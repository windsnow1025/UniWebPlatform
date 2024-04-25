from typing import Callable

from app.model.message import Message


def handle_request(
        messages: list[Message],
        reduce_credit: Callable[[int], float]
) -> float:
    prompt_tokens = sum(len(message.text) for message in messages)
    cost = reduce_credit(prompt_tokens)
    return cost
