import os

import google.generativeai as genai

from chat.client.implementations.non_stream_gemini_client import NonStreamGeminiProcessor
from chat.client.implementations.stream_gemini_client import StreamGeminiProcessor
from chat.logic.chat_generate.message_converter import convert_messages_to_gemini
from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.model.message import Message


async def create_gemini_client(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
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

    system_instruction = extract_system_messages(messages)

    generative_model = genai.GenerativeModel(
        model_name=f"models/{model}",
        generation_config=generation_config,
        safety_settings=safety_settings,
        system_instruction=system_instruction
    )

    gemini_messages = await convert_messages_to_gemini(messages)

    if stream:
        return StreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
        )
    else:
        return NonStreamGeminiProcessor(
            model=generative_model,
            messages=gemini_messages,
            temperature=temperature,
        )

