import logging
import re
from typing import AsyncGenerator

import httpx
from fastapi import HTTPException
from google.generativeai.types import GenerateContentResponse, AsyncGenerateContentResponse

from chat.client.model_client.gemini_client import GeminiClient


def process_delta(completion_delta: GenerateContentResponse) -> str:
    return completion_delta.text


async def generate_chunk(response: AsyncGenerateContentResponse) -> AsyncGenerator[str, None]:
    async for response_delta in response:
        content_delta = process_delta(response_delta)
        yield content_delta


class StreamGeminiClient(GeminiClient):
    async def generate_response(self):
        try:
            logging.info(f"messages: {self.messages}")
            response = await self.model.generate_content_async(
                contents=self._to_dict(self.messages),
                stream=True,
            )

            return generate_chunk(response)

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
