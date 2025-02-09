import json
import logging
from collections.abc import AsyncGenerator
from typing import Callable, Awaitable

from fastapi.responses import StreamingResponse

from app.logic.chat.util.token_counter import num_tokens_from_text

ChunkGenerator = AsyncGenerator[str, None]
ReduceCredit = Callable[[int], Awaitable[float]]


async def non_stream_handler(
        content: str,
        reduce_credit: ReduceCredit
) -> str:
    completion_tokens = num_tokens_from_text(content)
    await reduce_credit(completion_tokens)
    logging.info(f"content: {content}")
    return content


async def stream_handler(
        generator: ChunkGenerator,
        reduce_credit: ReduceCredit
) -> StreamingResponse:

    async def wrapper_generator() -> AsyncGenerator[str, None]:
        content = ""
        async for chunk in generator:
            content += chunk
            yield f"data: {json.dumps(chunk)}\n\n"
        completion_tokens = num_tokens_from_text(content)
        await reduce_credit(completion_tokens)
        logging.info(f"content: {content}")

    response = StreamingResponse(wrapper_generator(), media_type='text/event-stream')
    return response
