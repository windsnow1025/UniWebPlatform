from typing import AsyncGenerator


class ChatClient:
    def generate_response(self) -> str | AsyncGenerator[str, None]:
        raise NotImplementedError
