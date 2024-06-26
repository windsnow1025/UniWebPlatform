from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.interfaces.chat_processor import ChatProcessor
from chat.model.gpt_message import GptMessage


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
