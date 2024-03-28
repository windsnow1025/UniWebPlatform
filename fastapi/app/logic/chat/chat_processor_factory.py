import os
from typing import Callable, Generator
from fastapi.responses import StreamingResponse

from openai import OpenAI
from openai.lib.azure import AzureOpenAI

from app.logic.chat.chat_processor import StreamChatProcessor, NonStreamChatProcessor
from app.model.message import Message


def create_chat_processor(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        stream_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_handler: Callable[[str], str] = None
):

    openai = None
    if api_type == "open_ai":
        openai = OpenAI(
            api_key=os.environ["OPENAI_API_KEY"],
        )
    elif api_type == "azure":
        openai = AzureOpenAI(
            api_version="2023-12-01-preview",
            azure_endpoint=os.environ["AZURE_API_BASE"],
            api_key=os.environ["AZURE_API_KEY"],
        )

    if stream:
        return StreamChatProcessor(
            model=model,
            messages=messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            stream_handler=stream_handler
        )
    else:
        return NonStreamChatProcessor(
            model=model,
            messages=messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            non_stream_handler=non_stream_handler
        )
