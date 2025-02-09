from typing import AsyncGenerator

from chat.type.chat_response import ChatResponse


class ChatClient:
    def generate_response(self) -> ChatResponse | AsyncGenerator[ChatResponse, None]:
        raise NotImplementedError
