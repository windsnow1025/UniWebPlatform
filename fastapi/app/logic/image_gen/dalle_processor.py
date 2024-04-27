from app.logic.chat.handler.response_handler import NonStreamResponseHandler, StreamResponseHandler
from app.logic.chat.processor.interfaces.chat_processor import ChatProcessor
from app.model.gpt_message import GptMessage


class DalleProcessor:
    def __init__(
            self,
            model: str,
            prompt: str,
            size: str,
            quality: str,
            n,
    ):
        pass
