import openai.lib.azure

from chat.client.implementations.non_stream_gpt_client import NonStreamGPTClient
from chat.client.implementations.stream_gpt_client import StreamGPTClient
from chat.logic.chat_generate.model_message_converter import convert_messages_to_gpt
from chat.model.message import Message


async def create_gpt_client(
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        api_keys: dict
):
    client = None
    if api_type == "OpenAI":
        client = openai.AsyncOpenAI(
            api_key=api_keys["OPENAI_API_KEY"],
        )
    elif api_type == "Azure":
        client = openai.lib.azure.AsyncAzureOpenAI(
            api_version="2024-02-01",
            azure_endpoint=api_keys["AZURE_API_BASE"],
            api_key=api_keys["AZURE_API_KEY"],
        )
    elif api_type == "GitHub":
        client = openai.AsyncOpenAI(
            base_url="https://models.inference.ai.azure.com",
            api_key=api_keys["GITHUB_API_KEY"],
        )

    gpt_messages = await convert_messages_to_gpt(messages)

    if stream:
        return StreamGPTClient(
            model=model,
            messages=gpt_messages,
            temperature=temperature,
            api_type=api_type,
            client=client,
        )
    else:
        return NonStreamGPTClient(
            model=model,
            messages=gpt_messages,
            temperature=temperature,
            api_type=api_type,
            client=client,
        )