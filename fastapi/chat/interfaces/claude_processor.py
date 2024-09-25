from anthropic import Anthropic

from chat.interfaces.chat_processor import ChatProcessor
from chat.model.claude_message import ClaudeMessage


class ClaudeProcessor(ChatProcessor):
    def __init__(
            self,
            model: str,
            messages: list[ClaudeMessage],
            temperature: float,
            system: str,
            anthropic: Anthropic,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.system = system
        self.anthropic = anthropic

    def process_request(self):
        raise NotImplementedError
