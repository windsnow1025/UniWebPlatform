import logging
from typing import Callable, Generator

from fastapi.responses import StreamingResponse

from app.api.completion_router import ChatRequest
from app.dao import user_dao
from app.util import pricing


def non_stream_handler(
        content: str,
        username: str,
        chat_request: ChatRequest
) -> str:
    user_dao.reduce_credit(
        username=username,
        cost=pricing.calculate_cost(
            api_type=chat_request.api_type,
            model=chat_request.model,
            prompt_tokens=0,
            completion_tokens=len(content)
        )
    )
    logging.info(f"content: {content}")
    return content


def stream_handler(
        generator_function: Callable[[], Generator[str, None, None]],
        username: str,
        chat_request: ChatRequest
) -> StreamingResponse:
    def wrapper_generator() -> Generator[str, None, str]:
        content = ""
        for chunk in generator_function():
            content += chunk
            yield chunk
        user_dao.reduce_credit(
            username=username,
            cost=pricing.calculate_cost(
                api_type=chat_request.api_type,
                model=chat_request.model,
                prompt_tokens=0,
                completion_tokens=len(content))
        )
        logging.info(f"content: {content}")
        return content

    return StreamingResponse(wrapper_generator(), media_type='text/plain')