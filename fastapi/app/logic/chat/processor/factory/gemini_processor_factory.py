import os
from io import BytesIO
from typing import Callable, Generator

import PIL.Image
import google.generativeai as genai
import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from app.logic.chat.processor.implementations.non_stream_gemini_processor import NonStreamGeminiProcessor
from app.logic.chat.processor.implementations.stream_gemini_processor import StreamGeminiProcessor
from app.model.message import Message
from app.model.gemini_message import GeminiMessage


async def create_gemini_processor(
        host: str,
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

    gemini_messages = await convert_messages_to_gemini(messages, host)

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


async def convert_messages_to_gemini(messages: list[Message], host: str) -> list[GeminiMessage]:
    return [await convert_message_to_gemini(message, host) for message in messages]


async def convert_message_to_gemini(message: Message, host: str) -> GeminiMessage:
    role = ""
    if message.role == "user" or message.role == "system":
        role = "user"
    elif message.role == "assistant":
        role = "model"

    parts = [message.text]

    for image_url in message.files:
        image_data = await get_img_data(image_url, host)
        image = PIL.Image.open(image_data)
        parts.append(image)

    return GeminiMessage(role=role, parts=parts)


async def get_img_data(img_url: str, host) -> BytesIO:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        return BytesIO(response.content)