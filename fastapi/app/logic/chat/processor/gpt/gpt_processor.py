from app.logic.chat.handler.response_handler import NonStreamResponseHandler, StreamResponseHandler
from app.logic.chat.processor.chat_processor import ChatProcessor
from app.model.message import Message


class GPTProcessor(ChatProcessor):
    def __init__(
            self,
            model: str,
            messages: list[Message],
            temperature: float,
            api_type: str,
            openai,
            response_handler: NonStreamResponseHandler | StreamResponseHandler
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai
        self.response_handler = response_handler

    def process_request(self):
        raise NotImplementedError
