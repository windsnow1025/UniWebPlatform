import logging
import re
from typing import Generator

import anthropic
import httpx
from anthropic import MessageStream
from fastapi import HTTPException

from chat.interfaces.claude_processor import ClaudeProcessor


def process_delta(completion_delta: str) -> str:
    return completion_delta


def generate_chunk(response: MessageStream) -> Generator[str, None, None]:
    for response_delta in response.text_stream:
        content_delta = process_delta(response_delta)
        yield content_delta


class StreamClaudeProcessor(ClaudeProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")

            stream_manager = self.anthropic.messages.stream(
                model=self.model,
                max_tokens=4096,
                temperature=self.temperature,
                system=self.system,
                messages=self._to_dict(self.messages)
            )

            stream = stream_manager.__enter__()

            return self.response_handler(lambda: generate_chunk(stream))

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
