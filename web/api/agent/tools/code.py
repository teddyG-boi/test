from typing import Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from langchain import LLMChain
from langchain.prompts import SystemMessagePromptTemplate

from caelum_platform.web.api.agent.tools.tool import Tool
from caelum_platform.web.api.agent.prompts import code_prompt


class Code(Tool):
    description = "Should only be used to write code, refactor code, fix code bugs, and explain programming concepts."
    public_description = "Write and review code."

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        chain = LLMChain(llm=self.model, prompt=code_prompt)

        return StreamingResponse.from_chain(
            chain,
            {"goal": goal, "language": self.language, "task": task},
            media_type="text/event-stream",
        )
