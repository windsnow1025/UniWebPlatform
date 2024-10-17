from anthropic import Anthropic, AsyncAnthropic

from chat.client.chat_client import ChatClient
from chat.model.claude_message import ClaudeMessage


class ClaudeClient(ChatClient):
    def __init__(
            self,
            model: str,
            messages: list[ClaudeMessage],
            temperature: float,
            system: str,
            anthropic: AsyncAnthropic,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.system = system
        self.anthropic = anthropic

    def generate_response(self):
        raise NotImplementedError
