import logging
import re
from typing import Generator, AsyncGenerator

import httpx
from anthropic import AsyncMessageStream
from fastapi import HTTPException

from chat.client.model_client.claude_client import ClaudeClient


def process_delta(completion_delta: str) -> str:
    return completion_delta


async def generate_chunk(response: AsyncMessageStream) -> AsyncGenerator[str, None]:
    async for response_delta in response.text_stream:
        content_delta = process_delta(response_delta)
        yield content_delta


class StreamClaudeProcessor(ClaudeClient):
    async def generate_response(self):
        try:
            logging.info(f"messages: {self.messages}")

            async with await self.anthropic.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=self.temperature,
                system=self.system,
                messages=self._to_dict(self.messages),
                stream=True,
            ) as stream_manager:

                return generate_chunk(stream_manager)

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
