import logging
import re

import httpx
import openai
from fastapi import HTTPException
from openai import APIStatusError

from chat.client.model_client.gpt_client import GPTClient
from chat.type.chat_response import ChatResponse
from chat.type.serializer import serialize


class NonStreamGPTClient(GPTClient):
    async def generate_response(self) -> ChatResponse:
        try:
            logging.info(f"messages: {self.messages}")
            completion = await self.client.chat.completions.create(
                messages=serialize(self.messages),
                model=self.model,
                temperature=self.temperature,
                stream=False
            )

            content = completion.choices[0].message.content
            return ChatResponse(text=content, display=None)
        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            text = e.response.text
            raise HTTPException(status_code=status_code, detail=text)
        except openai.BadRequestError as e:
            status_code = e.status_code
            text = e.message
            raise HTTPException(status_code=status_code, detail=text)
        except APIStatusError as e:
            status_code = e.status_code
            text = e.message
            raise HTTPException(status_code=status_code, detail=text)
        except Exception as e:
            logging.exception(e)
            match = re.search(r'\d{3}', str(e))
            if match:
                error_code = int(match.group(0))
            else:
                error_code = 500

            raise HTTPException(status_code=error_code, detail=str(e))
