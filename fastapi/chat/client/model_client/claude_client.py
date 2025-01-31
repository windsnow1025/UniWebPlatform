import anthropic

from chat.client.chat_client import ChatClient
from chat.type.model_message.claude_message import ClaudeMessage


class ClaudeClient(ChatClient):
    def __init__(
            self,
            model: str,
            messages: list[ClaudeMessage],
            temperature: float,
            system: str,
            client: anthropic.AsyncAnthropic,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.system = system
        self.client = client

    def generate_response(self):
        raise NotImplementedError
