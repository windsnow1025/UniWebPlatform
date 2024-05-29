import os
from typing import Callable, Generator

import google.generativeai as genai
from fastapi.responses import StreamingResponse

from app.logic.chat.processor.factory.model_processor_factory.file_processor.document_processor import \
    extract_text_from_file
from app.logic.chat.processor.factory.model_processor_factory.file_processor.file_type_checker import get_file_type
from app.logic.chat.processor.factory.model_processor_factory.gemini_image_processor import get_image_part_from_file
from app.logic.chat.processor.implementations.non_stream_gemini_processor import NonStreamGeminiProcessor
from app.logic.chat.processor.implementations.stream_gemini_processor import StreamGeminiProcessor
from app.model.gemini_message import GeminiMessage
from app.model.message import Message


async def create_gemini_processor(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        stream_response_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
        non_stream_response_handler: Callable[[str], str] = None
):
    genai.configure(api_key=os.environ["GOOGLE_AI_STUDIO_API_KEY"])

    generation_config = {
        "temperature": temperature
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

    generative_model = genai.GenerativeModel(
        model_name=f"models/{model}",
        generation_config=generation_config,
        safety_settings=safety_settings
    )

    gemini_messages = await convert_messages_to_gemini(messages)

    if stream:
        return StreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
            response_handler=non_stream_response_handler
        )


async def convert_messages_to_gemini(messages: list[Message]) -> list[GeminiMessage]:
    return [await convert_message_to_gemini(message) for message in messages]


async def convert_message_to_gemini(message: Message) -> GeminiMessage:
    role = message.role
    text = message.text
    files = message.files

    gemini_role = ""
    if role == "user" or role == "system":
        gemini_role = "user"
    elif role == "assistant":
        gemini_role = "model"

    parts = []

    if text:
        parts.append(text)
    else:
        parts.append("")

    for file in files:
        if get_file_type(file) == "image":
            image_contents = await get_image_part_from_file(file)
            parts.append(image_contents)
        else:
            file_text = await extract_text_from_file(file)
            if parts and isinstance(parts[0], str):
                parts[0] = file_text + "\n" + parts[0]
            else:
                parts.insert(0, file_text)

    return GeminiMessage(role=gemini_role, parts=parts)
