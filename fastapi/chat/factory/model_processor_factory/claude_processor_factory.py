import os

import anthropic

from chat.factory.message_converter import convert_messages_to_gpt, convert_messages_to_claude
from chat.implementations.non_stream_claude_processor import NonStreamClaudeProcessor
from chat.implementations.stream_claude_processor import StreamClaudeProcessor
from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.model.message import Message


async def create_claude_processor(
        messages: list[Message],
        model: str,
        temperature: float,
        stream: bool,
        stream_response_handler: StreamResponseHandler | None = None,
        non_stream_response_handler: NonStreamResponseHandler | None = None
):
    client = anthropic.Anthropic(
        api_key=os.environ["ANTHROPIC_API_KEY"],
    )

    claude_messages = await convert_messages_to_claude(messages)

    if stream:
        return StreamClaudeProcessor(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system="",
            anthropic=client,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamClaudeProcessor(
            model=model,
            messages=claude_messages,
            temperature=temperature,
            system="",
            anthropic=client,
            response_handler=non_stream_response_handler
        )


