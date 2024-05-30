from app.logic.chat.handler.response_handler import NonStreamResponseHandler, StreamResponseHandler
from app.logic.chat.processor.chat_processor.interfaces.chat_processor import ChatProcessor
from app.model.gpt_message import GptMessage


class GPTProcessor(ChatProcessor):
    def __init__(
            self,
            model: str,
            messages: list[GptMessage],
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
