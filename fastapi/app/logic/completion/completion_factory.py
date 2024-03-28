from typing import Callable

from app.model.message import Message


def create_completion(
        completion_creator: Callable,
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool):
    if model == "gpt-4-vision-preview":
        return completion_creator(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
            max_tokens=4096,
        )
    else:
        return completion_creator(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
        )
