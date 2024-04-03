import logging
from typing import Callable, TypedDict

from fastapi.responses import StreamingResponse

from app.model.generator import ChunkGenerator

ReduceCredit = Callable[[int], float]


def non_stream_handler(
        content: str,
        reduce_credit: ReduceCredit
) -> (str, float):
    completion_tokens = len(content)
    cost = reduce_credit(completion_tokens)
    logging.info(f"content: {content}")
    return content


def stream_handler(
        generator_function: Callable[[], ChunkGenerator],
        reduce_credit: ReduceCredit
) -> StreamingResponse:

    def wrapper_generator():
        content = ""
        for chunk in generator_function():
            content += chunk
            yield chunk
        completion_tokens = len(content)
        cost = reduce_credit(completion_tokens)

    response = StreamingResponse(wrapper_generator(), media_type='text/plain')
    return response
