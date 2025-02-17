import pytest
from openai import AsyncOpenAI

from chat.client.implementations.gpt.non_stream_gpt_client import NonStreamGPTClient
from chat.logic.chat_generate.chat_client_factory import create_chat_client
from chat.type.model_message.gpt_message import GptMessage, TextContent
from chat.type.message import Message, Role


@pytest.fixture
def sample_messages():
    return [
        Message(role=Role.System, text="You are a helpful assistant.", file_urls=[]),
        Message(role=Role.User, text="Hello", file_urls=[])
    ]


@pytest.mark.asyncio
async def test_create_gpt_client_openai():
    messages = [Message(role=Role.User, text="Hello", file_urls=[])]
    model = "gpt-4o"
    api_type = "OpenAI"
    temperature = 0
    stream = False
    api_keys = {
        "OPENAI_API_KEY": "test-key"
    }

    client = await create_chat_client(
        messages=messages,
        model=model,
        api_type=api_type,
        temperature=temperature,
        stream=stream,
        api_keys=api_keys
    )

    assert isinstance(client, NonStreamGPTClient)
    assert client.model == model
    assert client.temperature == temperature
    assert client.api_type == api_type
    assert isinstance(client.client, AsyncOpenAI)

    assert len(client.messages) == len(messages)
    assert isinstance(client.messages[0], GptMessage)
    assert client.messages[0].role == Role.User
    assert isinstance(client.messages[0].content, list)
    assert isinstance(client.messages[0].content[0], TextContent)
    assert client.messages[0].content[0].text == "Hello"
