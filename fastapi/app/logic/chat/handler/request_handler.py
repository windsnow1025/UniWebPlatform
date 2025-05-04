from typing import Callable, Awaitable

from llm_bridge import Message, ContentType

from app.logic.chat.util.token_counter import num_tokens_from_text


async def handle_request(
        messages: list[Message],
        reduce_credit: Callable[[int, int], Awaitable[float]]
) -> float:
    input_tokens = calculate_token_count(messages)
    return await reduce_credit(input_tokens, 0)


def calculate_token_count(messages: list[Message]) -> int:
    text = ''
    file_count = 0

    for message in messages:
        for content in message.contents:
            if content.type == ContentType.Text:
                text += content.data
            elif content.type == ContentType.File:
                file_count += 1

    return num_tokens_from_text(text) + file_count * 1000
