from chat.client.chat_client import ChatClient
from chat.logic.chat_generate.model_client_factory.claude_client_factory import create_claude_client
from chat.logic.chat_generate.model_client_factory.gemini_client_factory import create_gemini_client
from chat.logic.chat_generate.model_client_factory.gpt_client_factory import create_gpt_client
from chat.type.message import Message


async def create_chat_client(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        api_keys: dict
) -> ChatClient:
    if api_type == 'OpenAI':
        return await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            api_keys={"OPENAI_API_KEY": api_keys["OPENAI_API_KEY"]}
        )
    elif api_type == 'Azure':
        return await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            api_keys={
                "AZURE_API_KEY": api_keys["AZURE_API_KEY"],
                "AZURE_API_BASE": api_keys["AZURE_API_BASE"]
            }
        )
    elif api_type == 'GitHub':
        return await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            api_keys={"GITHUB_API_KEY": api_keys["GITHUB_API_KEY"]}
        )
    elif api_type == 'Gemini':
        return await create_gemini_client(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
            api_key=api_keys["GOOGLE_AI_STUDIO_API_KEY"]
        )
    elif api_type == 'Claude':
        return await create_claude_client(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
            api_key=api_keys["ANTHROPIC_API_KEY"]
        )
    else:
        return ChatClient()
