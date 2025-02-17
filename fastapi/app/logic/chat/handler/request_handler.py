from typing import Callable, Awaitable

from app.logic.chat.util.token_counter import num_tokens_from_text
from llm_bridge import Message


async def handle_request(
        messages: list[Message],
        reduce_credit: Callable[[int], Awaitable[float]]
) -> float:
    text = ''.join(message.text for message in messages)
    file_length = sum(len(message.file_urls) for message in messages)
    prompt_tokens = num_tokens_from_text(text) + file_length * 1000
    cost = await reduce_credit(prompt_tokens)
    return cost
