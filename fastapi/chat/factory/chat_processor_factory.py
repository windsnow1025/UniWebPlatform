from typing import Callable, Generator

from fastapi.responses import StreamingResponse

from chat.factory.model_processor_factory.gemini_processor_factory import create_gemini_processor
from chat.factory.model_processor_factory.gpt_processor_factory import create_gpt_processor
from chat.model.message import Message


async def create_chat_processor(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        stream_response_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_response_handler: Callable[[str], str] = None
):
    if api_type == 'open_ai' or api_type == 'azure':
        return await create_gpt_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            stream_response_handler=stream_response_handler,
            non_stream_response_handler=non_stream_response_handler
        )
    elif api_type == 'gemini':
        return await create_gemini_processor(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
            stream_response_handler=stream_response_handler,
            non_stream_response_handler=non_stream_response_handler
        )
