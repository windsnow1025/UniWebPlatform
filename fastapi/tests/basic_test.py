import pytest
from llm_bridge import *


@pytest.fixture
def sample_messages():
    return [
        Message(
            role=Role.System,
            contents=[
                Content(
                    type=ContentType.Text,
                    data="You are a helpful assistant."
                )
            ]
        ),
        Message(
            role=Role.User,
            contents=[
                Content(
                    type=ContentType.Text,
                    data="Hello"
                )
            ]
        )
    ]

@pytest.mark.asyncio
async def test_basic(sample_messages):
    messages = sample_messages
    model = "gpt-4o"
    api_type = "OpenAI"
    temperature = 0
    stream = False
    api_keys = {
        "OPENAI_API_KEY": "test-key"
    }

    assert True