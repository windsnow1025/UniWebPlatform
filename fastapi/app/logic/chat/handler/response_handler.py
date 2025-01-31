import json
import logging
from collections.abc import AsyncGenerator
from typing import Callable, Awaitable

from fastapi.responses import StreamingResponse

from app.logic.chat.util.token_counter import num_tokens_from_text
from chat import *

ChunkGenerator = AsyncGenerator[ChatResponse, None]
ReduceCredit = Callable[[int], Awaitable[float]]


async def non_stream_handler(
        content: ChatResponse,
        reduce_credit: ReduceCredit
) -> ChatResponse:
    completion_tokens = num_tokens_from_text(content.text)
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
            content += chunk.text
            yield json.dumps(serialize(chunk))
        completion_tokens = num_tokens_from_text(content)
        await reduce_credit(completion_tokens)
        logging.info(f"content: {content}")

    response = StreamingResponse(wrapper_generator(), media_type='text/plain')
    return response
