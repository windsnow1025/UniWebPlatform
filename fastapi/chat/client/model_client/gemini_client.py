from google.generativeai import GenerativeModel

from chat.client.chat_client import ChatClient
from chat.model.gemini_message import GeminiMessage


class GeminiClient(ChatClient):
    def __init__(
            self,
            model: GenerativeModel,
            messages: list[GeminiMessage],
            temperature: float,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature

    def generate_response(self):
        raise NotImplementedError
