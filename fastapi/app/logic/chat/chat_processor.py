import logging
from typing import Callable, Generator
from fastapi.responses import StreamingResponse

from openai import Stream
from openai.types.chat import ChatCompletionChunk

from app.logic.chat.completion_factory import create_completion
from app.model.message import Message


class ChatProcessor:
    def __init__(
            self,
            model: str,
            messages: list[Message],
            temperature: float,
            api_type: str,
            openai,
            stream_handler: Callable[[Callable[[], Generator[str, None, None]]], StreamingResponse] | None = None,
            non_stream_handler: Callable[[str], None] = None
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai
        self.stream_handler = stream_handler
        self.non_stream_handler = non_stream_handler

    def process_request(self):
        raise NotImplementedError


class NonStreamChatProcessor(ChatProcessor):
    def process_request(self) -> str:
        try:
            logging.info(f"messages: {self.messages}")
            completion = create_completion(
                completion_creator=self.openai.chat.completions.create,
                messages=self.messages,
                model=self.model,
                temperature=self.temperature,
                stream=False
            )

            content = completion.choices[0].message.content
            self.non_stream_handler(content)
            return content
        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)


class StreamChatProcessor(ChatProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            completion = create_completion(
                completion_creator=self.openai.chat.completions.create,
                messages=self.messages,
                model=self.model,
                temperature=self.temperature,
                stream=True
            )

            def process_delta(completion_delta: ChatCompletionChunk) -> str:
                # Necessary for Azure
                if not completion_delta.choices:
                    return ""

                content_delta = completion_delta.choices[0].delta.content
                if not content_delta:
                    content_delta = ""
                logging.debug(f"chunk: {content_delta}")
                return content_delta

            def generate_chunk(completion: Stream[ChatCompletionChunk]) -> Generator[str, None, None]:
                content = ""
                for completion_delta in completion:
                    content_delta = process_delta(completion_delta)
                    content += content_delta
                    yield content_delta

            return self.stream_handler(lambda: generate_chunk(completion))

        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)
