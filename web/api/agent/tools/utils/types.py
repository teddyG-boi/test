"""Type definitions for tools."""
from typing import Optional
from pydantic import BaseModel


class CitedSnippet(BaseModel):
    """A snippet of text with citation information.
    
    Example:
        snippet = CitedSnippet(
            index=1,
            text="Hello world",
            url="https://example.com",
            title="Example Page"
        )
    """
    index: Optional[int] = None
    text: str
    url: Optional[str] = None
    title: Optional[str] = None 