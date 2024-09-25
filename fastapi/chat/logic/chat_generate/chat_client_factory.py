from chat.logic.chat_generate.model_client_factory.claude_client_factory import create_claude_client
from chat.logic.chat_generate.model_client_factory.gemini_client_factory import create_gemini_client
from chat.logic.chat_generate.model_client_factory.gpt_client_factory import create_gpt_client
from chat.model.message import Message


async def create_chat_client(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
):
    if api_type in ['open_ai', 'azure', 'github']:
        return await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
        )
    elif api_type == 'gemini':
        return await create_gemini_client(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
        )
    elif api_type == 'claude':
        return await create_claude_client(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
        )
