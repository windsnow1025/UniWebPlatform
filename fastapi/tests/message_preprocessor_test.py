import pytest

from chat.logic.message_preprocess.message_preprocessor import extract_system_messages
from chat.type.message import Message, Role


@pytest.fixture
def sample_messages():
    return [
        Message(role=Role.System, text="You are a helpful assistant.", file_urls=[]),
        Message(role=Role.User, text="Hello", file_urls=[])
    ]

def test_extract_system_messages(sample_messages):
    extracted_text = extract_system_messages(sample_messages)

    assert extracted_text == "You are a helpful assistant.\n"

    assert len(sample_messages) == 1
    assert sample_messages[0].role == Role.User
    assert sample_messages[0].text == "Hello"