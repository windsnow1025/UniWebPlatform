import logging
import re

import httpx
from fastapi import HTTPException

from app.logic.chat.processor.chat_processor.interfaces.gemini_processor import GeminiProcessor


class NonStreamGeminiProcessor(GeminiProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")

            response = self.model.generate_content(
                contents=self._to_dict(self.messages),
                stream=False
            )

            return self.response_handler(response.text)
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