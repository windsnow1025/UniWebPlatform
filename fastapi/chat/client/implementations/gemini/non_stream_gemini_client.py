import logging
import re

import httpx
from fastapi import HTTPException

from chat.client.implementations.gemini.gemini_response_handler import PrintingStatus, GeminiResponseHandler
from chat.client.model_client.gemini_client import GeminiClient
from chat.type.chat_response import ChatResponse


class NonStreamGeminiClient(GeminiClient):
    async def generate_response(self) -> ChatResponse:
        try:
            logging.info(f"messages: {self.messages}")

            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=self.messages,
                config=self.config,
            )

            gemini_response_handler = GeminiResponseHandler()
            text, display = gemini_response_handler.process_gemini_response(response)

            # Citation
            if grounding_metadata := response.candidates[0].grounding_metadata:
                for grounding_support in grounding_metadata.grounding_supports:
                    citation = ""
                    for grounding_chunk_index in grounding_support.grounding_chunk_indices:
                        citation += f"[{str(grounding_chunk_index + 1)}]"

                    citation_text = grounding_support.segment.text
                    index = text.find(citation_text) + len(citation_text)
                    text = text[:index] + citation + text[index:]

            return ChatResponse(text=text, display=display)
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
