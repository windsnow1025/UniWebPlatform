import logging
from typing import Callable

from fastapi.responses import StreamingResponse

from app.logic.chat.util.token_counter import num_tokens_from_text
from chat import ChunkGenerator

ReduceCredit = Callable[[int], float]


def non_stream_handler(
        content: str,
        reduce_credit: ReduceCredit
) -> (str, float):
    completion_tokens = num_tokens_from_text(content)
    reduce_credit(completion_tokens)
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
        completion_tokens = num_tokens_from_text(content)
        reduce_credit(completion_tokens)
        logging.info(f"content: {content}")

    response = StreamingResponse(wrapper_generator(), media_type='text/plain')
    return response
