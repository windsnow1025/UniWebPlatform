import os

import anthropic

from chat.factory.message_converter import convert_messages_to_gpt, convert_messages_to_claude
from chat.implementations.non_stream_claude_processor import NonStreamClaudeProcessor
from chat.implementations.stream_claude_processor import StreamClaudeProcessor
from chat.logic.message_preprocessor import extract_system_messages
from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.model.message import Message


async def create_claude_processor(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
):
    client = anthropic.Anthropic(
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
        return NonStreamClaudeProcessor(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system="",
            anthropic=client,
        )


