from typing import Callable, Generator

from fastapi.responses import StreamingResponse

from app.logic.chat.processor.factory.gemini_processor_factory import create_gemini_processor
from app.logic.chat.processor.factory.gpt_processor_factory import create_gpt_processor
from app.model.message import Message


async def create_chat_processor(
        host: str,
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        stream_response_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_response_handler: Callable[[str], str] = None
):
    if api_type == 'open_ai' or api_type == 'azure':
        return create_gpt_processor(
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
            host=host,
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
            stream_response_handler=stream_response_handler,
            non_stream_response_handler=non_stream_response_handler
        )
