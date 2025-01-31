import logging
import re

import httpx
from fastapi import HTTPException

from chat.client.implementations.gemini.gemini_response_handler import PrintingStatus, GeminiResponseHandler
from chat.client.model_client.gemini_client import GeminiClient


class NonStreamGeminiClient(GeminiClient):
    async def generate_response(self) -> str:
        try:
            logging.info(f"messages: {self.messages}")

            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=self.messages,
                config=self.config,
            )

            gemini_response_handler = GeminiResponseHandler()
            output = gemini_response_handler.process_gemini_response(response)
            return output
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
