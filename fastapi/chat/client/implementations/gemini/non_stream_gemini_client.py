import logging
import re

import httpx
from fastapi import HTTPException

from chat.client.implementations.gemini.printing_status import PrintingStatus
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

            printing_status = PrintingStatus.Start
            output = ""
            
            for part in response.candidates[0].content.parts:
                if part.thought and printing_status == PrintingStatus.Start:
                    output += "# Model Thought:\n\n"
                    printing_status = PrintingStatus.Thought
                elif not part.thought and printing_status == PrintingStatus.Thought:
                    output += f"\n\n# Model Response:\n\n"
                    printing_status = PrintingStatus.Response
                output += part.text
            if grounding_metadata := response.candidates[0].grounding_metadata:
                output += grounding_metadata.search_entry_point.rendered_content
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
