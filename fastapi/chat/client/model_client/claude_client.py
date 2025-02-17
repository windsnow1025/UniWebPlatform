from typing import AsyncGenerator

import anthropic

from chat.client.chat_client import ChatClient
from chat.type.chat_response import ChatResponse
from chat.type.model_message.claude_message import ClaudeMessage


class ClaudeClient(ChatClient):
    def __init__(
            self,
            model: str,
            messages: list[ClaudeMessage],
            temperature: float,
            system: str,
            client: anthropic.AsyncAnthropic,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.system = system
        self.client = client

    async def generate_response(self) -> ChatResponse | AsyncGenerator[ChatResponse, None]:
        raise NotImplementedError
