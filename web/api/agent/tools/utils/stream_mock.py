"""Mock streaming response for testing."""
from typing import AsyncGenerator, Optional

from fastapi.responses import StreamingResponse


async def stream_string(content: str) -> AsyncGenerator[bytes, None]:
    """Stream a string as bytes."""
    yield content.encode("utf-8") 