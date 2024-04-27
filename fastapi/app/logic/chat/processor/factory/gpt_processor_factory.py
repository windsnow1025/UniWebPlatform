import base64
import os
from io import BytesIO

import httpx
from fastapi import HTTPException
from openai import OpenAI
from openai.lib.azure import AzureOpenAI

from app.logic.chat.handler.response_handler import StreamResponseHandler, NonStreamResponseHandler
from app.logic.chat.processor.implementations.non_stream_gpt_processor import NonStreamGPTProcessor
from app.logic.chat.processor.implementations.stream_gpt_processor import StreamGPTProcessor
from app.model.message import Message
from app.model.gpt_message import *


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

        image_urls = []
        for file in files:
            base64_image = await encode_image_from_url(file)
            image_url = ImageURL(url=f"data:image/jpeg;base64,{base64_image}")
            image_urls.append(image_url)

        image_contents = []
        for image_url in image_urls:
            image_content = ImageContent(type="image_url", image_url=image_url)
            image_contents.append(image_content)

        for image_content in image_contents:
            content.append(image_content)

    return GptMessage(role=role, content=content)


async def encode_image_from_url(img_url: str) -> str:
    img_data = await get_img_data(img_url)
    return base64.b64encode(img_data.getvalue()).decode('utf-8')


async def get_img_data(img_url: str) -> BytesIO:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        return BytesIO(response.content)
