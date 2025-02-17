from typing import AsyncGenerator

from google import genai
from google.genai import types

from chat.client.chat_client import ChatClient
from chat.type.chat_response import ChatResponse
from chat.type.model_message.gemini_message import GeminiMessage


class GeminiClient(ChatClient):
    def __init__(
            self,
            model: str,
            messages: list[GeminiMessage],
            temperature: float,
            client: genai.Client,
            config: types.GenerateContentConfig,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.client = client
        self.config = config

    async def generate_response(self) -> ChatResponse | AsyncGenerator[ChatResponse, None]:
        raise NotImplementedError
