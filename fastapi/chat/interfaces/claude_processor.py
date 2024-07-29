from anthropic import Anthropic

from chat.model.claude_message import ClaudeMessage
from chat.model.handler import NonStreamResponseHandler, StreamResponseHandler
from chat.interfaces.chat_processor import ChatProcessor


class ClaudeProcessor(ChatProcessor):
    def __init__(
            self,
            model: str,
            messages: list[ClaudeMessage],
            temperature: float,
            system: str,
            anthropic: Anthropic,
            response_handler: NonStreamResponseHandler | StreamResponseHandler
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.system = system
        self.anthropic = anthropic
        self.response_handler = response_handler

    def process_request(self):
        raise NotImplementedError
