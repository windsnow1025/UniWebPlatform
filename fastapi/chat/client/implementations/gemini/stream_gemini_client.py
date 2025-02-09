import logging
import re
from typing import AsyncGenerator, AsyncIterator

import httpx
from fastapi import HTTPException
from google.genai import types

from chat.client.implementations.gemini.gemini_response_handler import GeminiResponseHandler
from chat.client.model_client.gemini_client import GeminiClient
from chat.type.chat_response import ChatResponse

gemini_response_handler = GeminiResponseHandler()


def process_delta(completion_delta: types.GenerateContentResponse) -> tuple[str, str]:
    return gemini_response_handler.process_gemini_response(completion_delta)


async def generate_chunk(
        response: AsyncIterator[types.GenerateContentResponse]
) -> AsyncGenerator[ChatResponse, None]:
    try:
        async for response_delta in response:
            text, display = process_delta(response_delta)
            yield ChatResponse(text=text, display=display)
    except Exception as e:
        logging.exception(e)
        yield ChatResponse(error=str(e))


class StreamGeminiClient(GeminiClient):
    async def generate_response(self) -> AsyncGenerator[ChatResponse, None]:
        try:
            logging.info(f"messages: {self.messages}")

            response = await self.client.aio.models.generate_content_stream(
                model=self.model,
                contents=self.messages,
                config=self.config,
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
