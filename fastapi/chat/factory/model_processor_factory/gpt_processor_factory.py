import os

from openai import OpenAI
from openai.lib.azure import AzureOpenAI

from chat.factory.message_converter import convert_messages_to_gpt
from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.implementations.non_stream_gpt_processor import NonStreamGPTProcessor
from chat.implementations.stream_gpt_processor import StreamGPTProcessor
from chat.model.message import Message


async def create_gpt_processor(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        stream_response_handler: StreamResponseHandler | None = None,
        non_stream_response_handler: NonStreamResponseHandler | None = None
):
    openai = None
    if api_type == "open_ai":
        openai = OpenAI(
            api_key=os.environ["OPENAI_API_KEY"],
        )
    elif api_type == "azure":
        openai = AzureOpenAI(
            api_version="2024-02-01",
            azure_endpoint=os.environ["AZURE_API_BASE"],
            api_key=os.environ["AZURE_API_KEY"],
        )
    elif api_type == "github":
        openai = OpenAI(
            base_url="https://models.inference.ai.azure.com",
            api_key=os.environ["GITHUB_API_KEY"],
        )

    gpt_messages = await convert_messages_to_gpt(messages)

    if stream:
        return StreamGPTProcessor(
            model=model,
            messages=gpt_messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamGPTProcessor(
            model=model,
            messages=gpt_messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            response_handler=non_stream_response_handler
        )


