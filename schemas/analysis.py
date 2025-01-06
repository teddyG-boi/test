from typing import List, Optional

from pydantic import BaseModel, Field, validator

from caelum_platform.web.api.agent.tools.tools import get_available_tools_names
from caelum_platform.web.api.agent.tools.search import Search
from caelum_platform.web.api.agent.tools.tools import get_tool_name
from caelum_platform.web.api.agent.tools.tools import get_default_tool_name


class AnalysisArguments(BaseModel):
    arg: str = Field(description="The argument to the function")
    reasoning: str = Field(description="The reasoning for the function and arg")


class Analysis(BaseModel):
    action: str = Field(description="The action to take")
    arg: str = Field(description="The argument to the function")
    reasoning: str = Field(description="The reasoning for the function and arg")

    @validator("action")
    def validate_action(cls, v: str) -> str:
        if v not in get_available_tools_names():
            return get_tool_name(Search)
        return v

    @staticmethod
    def get_default_analysis(task: str) -> "Analysis":
        return Analysis(
            action=get_default_tool_name(),
            arg=task,
            reasoning="I will help you with that task",
        ) 