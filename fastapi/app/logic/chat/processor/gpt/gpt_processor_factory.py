import os

from openai import OpenAI
from openai.lib.azure import AzureOpenAI

from app.logic.chat.handler.response_handler import StreamResponseHandler, NonStreamResponseHandler
from app.logic.chat.processor.gpt.non_stream_gpt_processor import NonStreamGPTProcessor
from app.logic.chat.processor.gpt.stream_gpt_processor import StreamGPTProcessor
from app.model.message import Message


def create_gpt_processor(
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

    if stream:
        return StreamGPTProcessor(
            model=model,
            messages=messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            response_handler=stream_response_handler
        )
    else:
        return NonStreamGPTProcessor(
            model=model,
            messages=messages,
            temperature=temperature,
            api_type=api_type,
            openai=openai,
            response_handler=non_stream_response_handler
        )
