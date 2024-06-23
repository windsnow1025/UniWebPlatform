import logging
import re
from typing import Generator

import httpx
from fastapi import HTTPException
from google.generativeai.types import GenerateContentResponse

from chat.interfaces.gemini_processor import GeminiProcessor


def process_delta(completion_delta: GenerateContentResponse) -> str:
    return completion_delta.text


def generate_chunk(response: GenerateContentResponse) -> Generator[str, None, None]:
    for response_delta in response:
        content_delta = process_delta(response_delta)
        yield content_delta


class StreamGeminiProcessor(GeminiProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            response = self.model.generate_content(
                contents=self._to_dict(self.messages),
                stream=True,
            )

            return self.response_handler(lambda: generate_chunk(response))

        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            text = e.response.text
            raise HTTPException(status_code=status_code, detail=text)
        except Exception as e:
            match = re.search(r'\d{3}', str(e))
            if match:
                error_code = int(match.group(0))
            else:
                error_code = 500

            raise HTTPException(status_code=error_code, detail=str(e))
