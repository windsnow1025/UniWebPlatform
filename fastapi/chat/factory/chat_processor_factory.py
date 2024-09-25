from chat.factory.model_processor_factory.claude_processor_factory import create_claude_processor
from chat.factory.model_processor_factory.gemini_processor_factory import create_gemini_processor
from chat.factory.model_processor_factory.gpt_processor_factory import create_gpt_processor
from chat.model.message import Message


async def create_chat_processor(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
):
    if api_type in ['open_ai', 'azure', 'github']:
        return await create_gpt_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
        )
    elif api_type == 'gemini':
        return await create_gemini_processor(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
        )
    elif api_type == 'claude':
        return await create_claude_processor(
            messages=messages,
            model=model,
            temperature=temperature,
            stream=stream,
        )
