from typing import Any

from fastapi.responses import StreamingResponse
from langchain.chains import LLMChain
from langchain.prompts import SystemMessagePromptTemplate
from langchain.chat_models.base import BaseChatModel

from caelum_platform.web.api.agent.tools.tool import Tool
from caelum_platform.web.api.agent.prompts import execute_task_prompt
from caelum_platform.web.api.agent.tools.utils import summarize
from caelum_platform.web.api.agent.tools.utils.stream_mock import stream_string


class Reason(Tool):
    description = (
        "Reason about task via existing information or understanding. "
        "Make decisions / selections from options."
    )

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> StreamingResponse:
        chain = LLMChain(llm=self.model, prompt=execute_task_prompt)
        result = await chain.arun({"goal": goal, "language": self.language, "task": task})
        return StreamingResponse(stream_string(result), media_type="text/event-stream")
