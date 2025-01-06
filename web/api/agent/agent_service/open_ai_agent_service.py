import json
from typing import Any, List, Optional, Tuple, Type

from fastapi.responses import StreamingResponse
from langchain import LLMChain
from langchain.callbacks.base import AsyncCallbackHandler
from langchain.chat_models.base import BaseChatModel
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage,
)
from loguru import logger
from pydantic import ValidationError

from caelum_platform.db.crud.oauth import OAuthCrud
from caelum_platform.schemas.agent import ModelSettings
from caelum_platform.schemas.user import UserBase
from caelum_platform.services.tokenizer.token_service import TokenService
from caelum_platform.web.api.agent.agent_service.agent_service import AgentService
from caelum_platform.schemas.analysis import Analysis, AnalysisArguments
from caelum_platform.web.api.agent.helpers import (
    call_model_with_handling,
    openai_error_handler,
    parse_with_handling,
)
from caelum_platform.web.api.agent.model_factory import WrappedChatOpenAI
from caelum_platform.web.api.agent.prompts import (
    analyze_task_prompt,
    chat_prompt,
    create_tasks_prompt,
    start_goal_prompt,
    summarize_prompt,
)
from caelum_platform.web.api.agent.task_output_parser import TaskOutputParser
from caelum_platform.web.api.agent.tools.open_ai_function import get_tool_function
from caelum_platform.web.api.agent.tools.tools import (
    get_available_tools,
    get_default_tool,
    get_tool_from_name,
    get_tool_name,
    get_tools_overview,
    get_user_tools,
)
from caelum_platform.web.api.agent.tools.utils import summarize
from caelum_platform.web.api.errors import OpenAIError
from caelum_platform.web.api.memory.memory import AgentMemory


class OpenAIAgentService(AgentService):
    def __init__(
        self,
        model: WrappedChatOpenAI,
        settings: ModelSettings,
        token_service: TokenService,
        callbacks: Optional[List[AsyncCallbackHandler]],
        user: UserBase,
        oauth_crud: OAuthCrud,
    ):
        self.model = model
        self.settings = settings
        self.token_service = token_service
        self.callbacks = callbacks
        self.user = user
        self.oauth_crud = oauth_crud

    async def start_goal_agent(self, *, goal: str) -> List[str]:
        prompt = ChatPromptTemplate.from_messages(
            [SystemMessagePromptTemplate(prompt=start_goal_prompt)]
        )

        self.token_service.calculate_max_tokens(
            self.model,
            prompt.format_prompt(
                goal=goal,
                language=self.settings.language,
            ).to_string(),
        )

        completion = await call_model_with_handling(
            self.model,
            ChatPromptTemplate.from_messages(
                [SystemMessagePromptTemplate(prompt=start_goal_prompt)]
            ),
            {"goal": goal, "language": self.settings.language},
            settings=self.settings,
            callbacks=self.callbacks,
        )

        task_output_parser = TaskOutputParser(completed_tasks=[])
        tasks = parse_with_handling(task_output_parser, completion)

        return tasks

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        user_tools = await get_user_tools(tool_names, self.user, self.oauth_crud)
        functions = list(map(get_tool_function, user_tools))
        prompt = analyze_task_prompt.format_prompt(
            goal=goal,
            task=task,
            language=self.settings.language,
        )

        self.token_service.calculate_max_tokens(
            self.model,
            prompt.to_string(),
            str(functions),
        )

        message = await openai_error_handler(
            func=self.model.apredict_messages,
            messages=prompt.to_messages(),
            functions=functions,
            settings=self.settings,
            callbacks=self.callbacks,
        )

        function_call = message.additional_kwargs.get("function_call", {})
        completion = function_call.get("arguments", "")

        try:
            pydantic_parser = PydanticOutputParser(pydantic_object=AnalysisArguments)
            analysis_arguments = parse_with_handling(pydantic_parser, completion)
            return Analysis(
                action=function_call.get("name", get_tool_name(get_default_tool())),
                **analysis_arguments.dict(),
            )
        except (OpenAIError, ValidationError):
            return Analysis.get_default_analysis(task)

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> StreamingResponse:
        # TODO: More mature way of calculating max_tokens
        if self.model.max_tokens > 3000:
            self.model.max_tokens = max(self.model.max_tokens - 1000, 3000)

        tool_class = get_tool_from_name(analysis.action)
        return await tool_class(self.model, self.settings.language).call(
            goal,
            task,
            analysis.arg,
            self.user,
            self.oauth_crud,
        )

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        prompt = ChatPromptTemplate.from_messages(
            [SystemMessagePromptTemplate(prompt=create_tasks_prompt)]
        )

        args = {
            "goal": goal,
            "language": self.settings.language,
            "tasks": "\n".join(tasks),
            "lastTask": last_task,
            "result": result,
        }

        self.token_service.calculate_max_tokens(
            self.model, prompt.format_prompt(**args).to_string()
        )

        completion = await call_model_with_handling(
            self.model, prompt, args, settings=self.settings, callbacks=self.callbacks
        )

        previous_tasks = (completed_tasks or []) + tasks
        return [completion] if completion not in previous_tasks else []

    async def summarize_task_agent(
        self,
        *,
        goal: str,
        results: List[str],
    ) -> StreamingResponse:
        self.model.model_name = "gpt-3.5-turbo-16k"
        self.model.max_tokens = 8000  # Total tokens = prompt tokens + completion tokens

        snippet_max_tokens = 7000  # Leave room for the rest of the prompt
        text_tokens = self.token_service.tokenize("".join(results))
        text = self.token_service.detokenize(text_tokens[0:snippet_max_tokens])
        logger.info(f"Summarizing text: {text}")

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="You are a helpful AI assistant that summarizes task results."),
            HumanMessage(content=f"""
Goal: {goal}
Task: Summarize the results
Language: {self.settings.language}
Results: {text}

Please provide a comprehensive summary of the results.
""")
        ])

        chain = LLMChain(llm=self.model, prompt=prompt)

        async def stream_chain():
            async for chunk in chain.astream({}):
                if chunk.get("text"):
                    yield f"data: {chunk['text']}\n\n"

        return StreamingResponse(
            stream_chain(),
            media_type="text/event-stream",
        )

    async def chat(
        self,
        *,
        message: str,
        results: List[str],
    ) -> StreamingResponse:
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate(prompt=chat_prompt),
                *[HumanMessage(content=result) for result in results],
                HumanMessage(content=message),
            ]
        )

        self.token_service.calculate_max_tokens(
            self.model,
            prompt.format_prompt(
                language=self.settings.language,
            ).to_string(),
        )

        chain = LLMChain(llm=self.model, prompt=prompt)

        async def stream_chain():
            async for chunk in chain.astream({"language": self.settings.language}):
                if chunk.get("text"):
                    yield f"data: {chunk['text']}\n\n"

        return StreamingResponse(
            stream_chain(),
            media_type="text/event-stream",
        )
