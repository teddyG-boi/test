from dataclasses import dataclass
from typing import List, Optional

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from langchain.chains import LLMChain
from langchain.chat_models.base import BaseChatModel
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate
from pydantic import BaseModel

from caelum_platform.web.api.agent.prompts import (
    summarize_prompt,
    summarize_with_sources_prompt,
    summarize_sid_prompt,
)


@dataclass
class Snippet:
    text: str
    url: str


@dataclass
class CitedSnippet:
    index: int
    text: str
    url: str


def summarize(
    model: BaseChatModel,
    language: str,
    goal: str,
    text: str,
) -> FastAPIStreamingResponse:
    chain = LLMChain(
        llm=model,
        prompt=ChatPromptTemplate.from_messages(
            [SystemMessagePromptTemplate(prompt=summarize_prompt)]
        ),
    )

    return FastAPIStreamingResponse.from_chain(
        chain,
        {
            "goal": goal,
            "language": language,
            "text": text,
        },
        media_type="text/event-stream",
    )


def summarize_with_sources(
    model: BaseChatModel,
    language: str,
    goal: str,
    snippets: List[Snippet],
) -> FastAPIStreamingResponse:
    chain = LLMChain(
        llm=model,
        prompt=ChatPromptTemplate.from_messages(
            [SystemMessagePromptTemplate(prompt=summarize_with_sources_prompt)]
        ),
    )

    return FastAPIStreamingResponse.from_chain(
        chain,
        {
            "goal": goal,
            "language": language,
            "text": "\n\n".join(
                [f"Source ({s.url}):\n{s.text}" for s in snippets]
            ),
        },
        media_type="text/event-stream",
    )


def summarize_sid(
    model: BaseChatModel,
    language: str,
    goal: str,
    snippets: List[Snippet],
) -> FastAPIStreamingResponse:
    chain = LLMChain(
        llm=model,
        prompt=ChatPromptTemplate.from_messages(
            [SystemMessagePromptTemplate(prompt=summarize_sid_prompt)]
        ),
    )

    return FastAPIStreamingResponse.from_chain(
        chain,
        {
            "goal": goal,
            "language": language,
            "text": "\n\n".join(
                [f"Source ({s.url}):\n{s.text}" for s in snippets]
            ),
        },
        media_type="text/event-stream",
    )
