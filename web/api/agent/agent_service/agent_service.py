from abc import ABC, abstractmethod
from typing import Any, List, Optional, Protocol

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from caelum_platform.web.api.agent.tools.tools import get_default_tool, get_tool_name
from caelum_platform.web.api.memory.memory import AgentMemory


class AgentService(Protocol):
    async def start_goal_agent(self, *, goal: str) -> List[str]:
        pass

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Any:
        pass

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Any,
    ) -> FastAPIStreamingResponse:
        pass

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        pass

    async def summarize_task_agent(
        self,
        *,
        goal: str,
        results: List[str],
    ) -> FastAPIStreamingResponse:
        pass

    async def chat(
        self,
        *,
        message: str,
        results: List[str],
    ) -> FastAPIStreamingResponse:
        pass
