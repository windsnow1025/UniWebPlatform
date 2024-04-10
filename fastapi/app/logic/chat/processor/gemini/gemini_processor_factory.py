import os
from typing import Callable, Generator

import google.generativeai as genai
from fastapi.responses import StreamingResponse

from app.model.message import Message


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
        # model_name="models/gemini-1.5-pro-latest",
        model_name=f"models/{model}",
        generation_config=generation_config,
        safety_settings=safety_settings
    )
