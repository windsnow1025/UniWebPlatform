import os
from typing import Callable, Generator

import google.generativeai as genai
from fastapi.responses import StreamingResponse

from app.logic.chat.processor.gemini.non_stream_gemini_processor import NonStreamGeminiProcessor
from app.logic.chat.processor.gemini.stream_gemini_processor import StreamGeminiProcessor
from app.model.message import Message, GeminiMessage


def create_gemini_processor(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        stream_response_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_response_handler: Callable[[str], str] = None
):
    genai.configure(api_key=os.environ["GOOGLE_AI_STUDIO_API_KEY"])

    generation_config = {
        "temperature": 0
    }

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        },
    ]

    model = genai.GenerativeModel(
        model_name=f"models/{model}",
        generation_config=generation_config,
        safety_settings=safety_settings
    )

    gemini_messages = convert_messages_to_gemini(messages)

    if stream:
        return StreamGeminiProcessor(
            model=model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamGeminiProcessor(
            model=model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=non_stream_response_handler
        )


def convert_messages_to_gemini(messages: list[Message]) -> list[GeminiMessage]:
    return [convert_message_to_gemini(message) for message in messages]


def convert_message_to_gemini(message: Message) -> GeminiMessage:
    if message['role'] == "assistant" or message['role'] == "system":
        role = "model"
    else:
        role = message['role']
    return GeminiMessage(role=role, parts=message['content'])
