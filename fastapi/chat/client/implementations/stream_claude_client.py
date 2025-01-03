import logging
import re
from typing import AsyncGenerator

import httpx
from fastapi import HTTPException

from chat.client.model_client.claude_client import ClaudeClient


class StreamClaudeClient(ClaudeClient):
    async def generate_response(self):
        try:
            logging.info(f"messages: {self.messages}")

            async def chunk_generator() -> AsyncGenerator[str, None]:
                async with self.client.messages.stream(
                    model=self.model,
                    max_tokens=4096,
                    temperature=self.temperature,
                    system=self.system,
                    messages=self._to_dict(self.messages)
                ) as stream:
                    async for response_delta in stream.text_stream:
                        yield response_delta

            return chunk_generator()

        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            text = e.response.text
            raise HTTPException(status_code=status_code, detail=text)
        except Exception as e:
            logging.exception(e)
            match = re.search(r'\d{3}', str(e))
            if match:
                error_code = int(match.group(0))
            else:
                error_code = 500

            raise HTTPException(status_code=error_code, detail=str(e))
