from google.generativeai import GenerativeModel

from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.interfaces.chat_processor import ChatProcessor
from chat.model.gemini_message import GeminiMessage


class GeminiProcessor(ChatProcessor):
    def __init__(
            self,
            model: GenerativeModel,
            messages: list[GeminiMessage],
            temperature: float,
            response_handler: NonStreamResponseHandler | StreamResponseHandler
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.response_handler = response_handler

    def process_request(self):
        raise NotImplementedError
