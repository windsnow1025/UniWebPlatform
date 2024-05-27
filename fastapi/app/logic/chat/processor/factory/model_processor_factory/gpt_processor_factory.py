import os

from openai import OpenAI
from openai.lib.azure import AzureOpenAI

from app.logic.chat.handler.response_handler import StreamResponseHandler, NonStreamResponseHandler
from app.logic.chat.processor.factory.model_processor_factory.gpt_image_processor import get_image_contents_from_files
from app.logic.chat.processor.implementations.non_stream_gpt_processor import NonStreamGPTProcessor
from app.logic.chat.processor.implementations.stream_gpt_processor import StreamGPTProcessor
from app.model.gpt_message import *
from app.model.message import Message


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


async def convert_messages_to_gpt(messages: list[Message]) -> list[GptMessage]:
    return [await convert_message_to_gpt(message) for message in messages]


async def convert_message_to_gpt(message: Message) -> GptMessage:
    role = message.role
    text = message.text
    files = message.files

    if len(files) == 0:
        content = text
    else:
        content = []

        text_content = TextContent(type="text", text=text)
        content.append(text_content)

        image_contents = await get_image_contents_from_files(files)
        content.extend(image_contents)

    return GptMessage(role=role, content=content)
