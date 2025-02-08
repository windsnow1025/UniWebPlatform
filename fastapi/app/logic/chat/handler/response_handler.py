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
        try:
            content = ""
            async for chunk in generator:
                content += chunk
                yield chunk
            completion_tokens = num_tokens_from_text(content)
            await reduce_credit(completion_tokens)
            logging.info(f"content: {content}")
        except Exception as e:
            logging.error(f"Stream error: {str(e)}")
            yield f"Stream error: {str(e)}"

    response = StreamingResponse(wrapper_generator(), media_type='text/plain')
    return response
