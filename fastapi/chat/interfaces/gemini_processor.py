from google.generativeai import GenerativeModel

from chat.interfaces.chat_processor import ChatProcessor
from chat.model.gemini_message import GeminiMessage


class GeminiProcessor(ChatProcessor):
    def __init__(
            self,
            model: GenerativeModel,
            messages: list[GeminiMessage],
            temperature: float,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature

    def process_request(self):
        raise NotImplementedError
