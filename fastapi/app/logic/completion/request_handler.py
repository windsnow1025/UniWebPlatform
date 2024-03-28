from typing import Callable

from app.model.message import Message


def handle_request(
        messages: list[Message],
        reduce_credit: Callable[[int], None]
) -> None:
    prompt_tokens = sum(len(message["content"]) for message in messages)
    reduce_credit(prompt_tokens)
    return
