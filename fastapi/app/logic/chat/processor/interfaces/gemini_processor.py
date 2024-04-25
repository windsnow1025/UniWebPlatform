from google.generativeai import GenerativeModel

from app.logic.chat.handler.response_handler import NonStreamResponseHandler, StreamResponseHandler
from app.logic.chat.processor.interfaces.chat_processor import ChatProcessor
from app.model.gemini_message import GeminiMessage


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
