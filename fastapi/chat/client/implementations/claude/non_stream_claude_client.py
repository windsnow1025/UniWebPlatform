import logging
import re

import httpx
from fastapi import HTTPException

from chat.client.model_client.claude_client import ClaudeClient
from chat.type.chat_response import ChatResponse
from chat.type.serializer import serialize


class NonStreamClaudeClient(ClaudeClient):
    async def generate_response(self) -> str:
        try:
            logging.info(f"messages: {self.messages}")
            message = await self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=self.temperature,
                system=self.system,
                messages=serialize(self.messages)
            )

            content = message.content[0].text
            return ChatResponse(text=content, display=None)
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
