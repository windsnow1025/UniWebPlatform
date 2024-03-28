import logging
from typing import Callable, Generator

from fastapi.responses import StreamingResponse


def non_stream_handler(
        content: str,
        reduce_credit: Callable[[int], None]
) -> str:
    completion_tokens = len(content)
    reduce_credit(completion_tokens)
    logging.info(f"content: {content}")
    return content


def stream_handler(
        generator_function: Callable[[], Generator[str, None, None]],
        reduce_credit: Callable[[int], None]
) -> StreamingResponse:
    def wrapper_generator() -> Generator[str, None, str]:
        content = ""
        for chunk in generator_function():
            content += chunk
            yield chunk
        completion_tokens = len(content)
        reduce_credit(completion_tokens)
        logging.info(f"content: {content}")
        return content

    return StreamingResponse(wrapper_generator(), media_type='text/plain')
