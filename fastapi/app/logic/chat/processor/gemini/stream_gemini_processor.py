import logging
import traceback
from typing import Generator

from google.generativeai.types import GenerateContentResponse

from app.logic.chat.processor.gemini.gemini_processor import GeminiProcessor


class StreamGeminiProcessor(GeminiProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            response = self.model.generate_content(self.messages, stream=True)

            def process_delta(completion_delta) -> str:
                return completion_delta.text

            def generate_chunk(response: GenerateContentResponse) -> Generator[str, None, None]:
                for response_delta in response:
                    content_delta = process_delta(response_delta)
                    yield content_delta

            return self.response_handler(lambda: generate_chunk(response))
        except Exception as e:
            logging.error(f"Exception: {e}")
            traceback.print_exc()
            return str(e)
