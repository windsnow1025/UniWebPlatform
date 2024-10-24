import os
from unittest.mock import patch

import openai
import pytest
from openai import AsyncOpenAI

from chat.client.implementations.non_stream_gpt_client import NonStreamGPTClient
from chat.client.implementations.stream_gpt_client import StreamGPTClient
from chat.logic.chat_generate.model_client_factory.gpt_client_factory import create_gpt_client
from chat.model.gpt_message import GptMessage, TextContent
from chat.model.message import Message


@pytest.fixture
def sample_messages():
    return [
        Message(role="system", text="You are a helpful assistant.", file_urls=[]),
        Message(role="user", text="Hello", file_urls=[])
    ]


@pytest.fixture
def expected_gpt_messages():
    return [
        GptMessage(role="system", content=[TextContent(type="text", text="You are a helpful assistant.")]),
        GptMessage(role="user", content=[TextContent(type="text", text="Hello")])
    ]


@pytest.mark.asyncio
async def test_create_gpt_client_openai():
    messages = [Message(role="user", text="Hello", file_urls=[])]
    model = "gpt-4"
    api_type = "open_ai"
    temperature = 0.7
    stream = False

    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        client = await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )

        assert isinstance(client, NonStreamGPTClient)
        assert client.model == model
        assert client.temperature == temperature
        assert client.api_type == api_type
        assert isinstance(client.client, AsyncOpenAI)


@pytest.mark.asyncio
async def test_create_gpt_client_azure():
    messages = [Message(role="user", text="Hello", file_urls=[])]
    model = "gpt-4"
    api_type = "azure"
    temperature = 0.7
    stream = False

    with patch.dict(os.environ, {
        "AZURE_API_KEY": "test-key",
        "AZURE_API_BASE": "https://test.openai.azure.com"
    }):

        client = await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )

        assert isinstance(client, NonStreamGPTClient)
        assert client.model == model
        assert client.temperature == temperature
        assert client.api_type == api_type
        assert isinstance(client.client, openai.lib.azure.AsyncAzureOpenAI)


@pytest.mark.asyncio
async def test_create_gpt_client_stream():
    messages = [Message(role="user", text="Hello", file_urls=[])]
    model = "gpt-4"
    api_type = "open_ai"
    temperature = 0.7
    stream = True

    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):

        client = await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )

        assert isinstance(client, StreamGPTClient)


@pytest.mark.asyncio
async def test_create_gpt_client_message_conversion(sample_messages, expected_gpt_messages):
    model = "gpt-4"
    api_type = "open_ai"
    temperature = 0.7
    stream = False

    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):

        client = await create_gpt_client(
            messages=sample_messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )

        assert len(client.messages) == len(expected_gpt_messages)
        for actual, expected in zip(client.messages, expected_gpt_messages):
            assert actual.role == expected.role
            assert actual.content == expected.content


@pytest.mark.asyncio
async def test_create_gpt_client_github():
    messages = [Message(role="user", text="Hello", file_urls=[])]
    model = "gpt-4"
    api_type = "github"
    temperature = 0.7
    stream = False

    with patch.dict(os.environ, {"GITHUB_API_KEY": "test-key"}):

        client = await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )

        assert isinstance(client, NonStreamGPTClient)
        assert client.model == model
        assert client.temperature == temperature
        assert client.api_type == api_type
        assert isinstance(client.client, AsyncOpenAI)
        assert client.client.base_url == "https://models.inference.ai.azure.com"


@pytest.mark.asyncio
async def test_create_gpt_client_with_missing_env_vars():
    messages = [Message(role="user", text="Hello", file_urls=[])]
    model = "gpt-4"
    api_type = "open_ai"
    temperature = 0.7
    stream = False

    with pytest.raises(KeyError):
        await create_gpt_client(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream
        )