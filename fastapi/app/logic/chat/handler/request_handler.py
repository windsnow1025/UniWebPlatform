from typing import Callable

from app.model.message import Message
from app.util.token_counter import num_tokens_from_text


def handle_request(
        messages: list[Message],
        reduce_credit: Callable[[int], float]
) -> float:
    text = ''.join(message.text for message in messages)
    file_length = sum(len(file) for message in messages for file in message.files)
    prompt_tokens = num_tokens_from_text(text) + file_length * 1000
    cost = reduce_credit(prompt_tokens)
    return cost
