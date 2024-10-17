import os

import anthropic

from chat.client.implementations.non_stream_claude_client import NonStreamClaudeClient
from chat.client.implementations.stream_claude_client import StreamClaudeProcessor
from chat.logic.chat_generate.message_converter import convert_messages_to_claude
from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.model.message import Message


async def create_claude_client(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
):
    client = anthropic.AsyncAnthropic(
        api_key=os.environ["ANTHROPIC_API_KEY"],
    )

    system = extract_system_messages(messages)
    if system == "":
        system = "/"

    claude_messages = await convert_messages_to_claude(messages)

    if stream:
        return StreamClaudeProcessor(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system=system,
            anthropic=client,
        )
    else:
        return NonStreamClaudeClient(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system=system,
            anthropic=client,
        )


