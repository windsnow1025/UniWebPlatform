from google import genai
from google.genai import types
from google.genai._api_client import HttpOptions

from chat.client.implementations.gemini.non_stream_gemini_client import NonStreamGeminiClient
from chat.client.implementations.gemini.stream_gemini_client import StreamGeminiClient
from chat.logic.chat_generate.model_message_converter.model_message_converter import convert_messages_to_gemini
from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.type.message import Message


async def create_gemini_client(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        api_key: str,
):
    client = genai.Client(
        api_key=api_key,
        http_options=HttpOptions(api_version='v1alpha') # Thinking
    )

    system_instruction = extract_system_messages(messages) or " "

    thinking_config = None
    tools = []
    if "thinking" in model:
        thinking_config = types.ThinkingConfig(include_thoughts=True)
    if "thinking" not in model and "gemini-2.0-flash-lite-preview-02-05" not in model:
        tools.append(
            types.Tool(
                google_search=types.GoogleSearch()
            )
        )

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
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
        ],
        tools=tools,
        thinking_config=thinking_config,
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
