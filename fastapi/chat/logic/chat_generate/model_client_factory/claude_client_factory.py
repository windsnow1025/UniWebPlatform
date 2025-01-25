import anthropic

from chat.client.implementations.non_stream_claude_client import NonStreamClaudeClient
from chat.client.implementations.stream_claude_client import StreamClaudeClient
from chat.logic.chat_generate.model_message_converter.model_message_converter import convert_messages_to_claude
from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.model.message import Message


async def create_claude_client(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        api_key: str,
):
    client = anthropic.AsyncAnthropic(
        api_key=api_key,
    )

    system = extract_system_messages(messages)
    if system == "":
        system = "/"

    claude_messages = await convert_messages_to_claude(messages)

    if stream:
        return StreamClaudeClient(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system=system,
            client=client,
        )
    else:
        return NonStreamClaudeClient(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system=system,
            client=client,
        )


