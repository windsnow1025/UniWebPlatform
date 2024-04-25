import logging
import traceback
from typing import Generator

from openai import Stream
from openai.types.chat import ChatCompletionChunk

from app.logic.chat.processor.interfaces.gpt_processor import GPTProcessor


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
    for completion_delta in completion:
        content_delta = process_delta(completion_delta)
        yield content_delta


class StreamGPTProcessor(GPTProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            completion = self.openai.chat.completions.create(
                messages=self._to_dict(self.messages),
                model=self.model,
                temperature=self.temperature,
                stream=True
            )

            return self.response_handler(lambda: generate_chunk(completion))

        except Exception as e:
            logging.error(f"Exception: {e}")
            traceback.print_exc()
            return str(e)
