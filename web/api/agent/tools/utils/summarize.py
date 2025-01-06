"""Utility functions for summarizing text."""
from typing import Optional, List, Dict, Any

from langchain.chat_models.base import BaseChatModel
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain


async def summarize(
    model: BaseChatModel,
    goal: str,
    task: str,
    language: str,
    output: Optional[str] = None,
) -> str:
    """Summarize the task execution result."""
    template = """Goal: {goal}
Task: {task}
Output: {output}

Summarize the task execution result in {language}. If the output is empty or None, explain that the task could not be completed."""

    prompt = PromptTemplate(
        template=template,
        input_variables=["goal", "task", "output", "language"],
    )

    chain = LLMChain(llm=model, prompt=prompt)
    return await chain.arun(
        goal=goal,
        task=task,
        output=output or "No output was generated.",
        language=language,
    )


async def summarize_with_sources(
    model: BaseChatModel,
    goal: str,
    task: str,
    language: str,
    sources: List[Dict[str, Any]],
    output: Optional[str] = None,
) -> str:
    """Summarize the task execution result with sources."""
    template = """Goal: {goal}
Task: {task}
Output: {output}
Sources: {sources}

Summarize the task execution result in {language}, including relevant information from the sources. If the output is empty or None, explain that the task could not be completed."""

    prompt = PromptTemplate(
        template=template,
        input_variables=["goal", "task", "output", "language", "sources"],
    )

    chain = LLMChain(llm=model, prompt=prompt)
    return await chain.arun(
        goal=goal,
        task=task,
        output=output or "No output was generated.",
        language=language,
        sources=sources,
    ) 