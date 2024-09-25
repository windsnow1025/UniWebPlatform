from chat.client.chat_client import ChatClient
from chat.model.gpt_message import GptMessage


class GPTClient(ChatClient):
    def __init__(
            self,
            model: str,
            messages: list[GptMessage],
            temperature: float,
            api_type: str,
            openai,
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai
    def generate_response(self):
        raise NotImplementedError
