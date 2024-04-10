from typing import Callable

from fastapi.responses import StreamingResponse

from app.model.generator import ChunkGenerator
from app.model.message import Message

NonStreamResponseHandler = Callable[
    [str],
    tuple[str, float]
]

StreamResponseHandler = Callable[
    [Callable[[], ChunkGenerator]],
    tuple[StreamingResponse, float]
]


class GPTProcessor:
    def __init__(
            self,
            model: str,
            messages: list[Message],
            temperature: float,
            api_type: str,
            openai,
            response_handler
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai
        self.response_handler = response_handler

    def process_request(self):
        raise NotImplementedError
