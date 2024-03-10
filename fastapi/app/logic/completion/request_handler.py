import logging

from app.api.completion_router import ChatRequest
from app.dao import user_dao
from app.util import pricing


def handle_request(
        username: str,
        chat_request: ChatRequest
) -> None:
    prompt_tokens = sum(len(message["content"]) for message in chat_request.messages)
    user_dao.reduce_credit(
        username=username,
        cost=pricing.calculate_cost(
            api_type=chat_request.api_type,
            model=chat_request.model,
            prompt_tokens=prompt_tokens,
            completion_tokens=0)
    )
    logging.info(f"username: {username}, model: {chat_request.model}")
    return
