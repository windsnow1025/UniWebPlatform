from google import genai
from google.genai import types

from chat.client.implementations.non_stream_gemini_client import NonStreamGeminiClient
from chat.client.implementations.stream_gemini_client import StreamGeminiClient
from chat.logic.chat_generate.model_message_converter.model_message_converter import convert_messages_to_gemini
from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.model.message import Message


async def create_gemini_client(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        api_key: str,
):
    client = genai.Client(api_key=api_key)

    system_instruction = extract_system_messages(messages) or " "

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=temperature,
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold = types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold = types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
                threshold = types.HarmBlockThreshold.BLOCK_NONE,
            ),
        ]
    )

    gemini_messages = await convert_messages_to_gemini(messages)

    if stream:
        return StreamGeminiClient(
            model=model,
            messages=gemini_messages,
            temperature=temperature,
            client=client,
            config=config,
        )
    else:
        return NonStreamGeminiClient(
            model=model,
            messages=gemini_messages,
            temperature=temperature,
            client=client,
            config=config,
        )
