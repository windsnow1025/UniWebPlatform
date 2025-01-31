import logging
import re
from typing import AsyncGenerator

import httpx
import openai
from fastapi import HTTPException
from openai import APIStatusError, AsyncStream
from openai.types.chat import ChatCompletionChunk

from chat.client.model_client.gpt_client import GPTClient
from chat.type.chat_response import ChatResponse
from chat.type.serializer import serialize


def process_delta(
        completion_delta: ChatCompletionChunk
) -> ChatResponse:
    if not completion_delta.choices: # Necessary for Azure
        content_delta = ""
    else:
        content_delta = completion_delta.choices[0].delta.content
    if not content_delta:
        content_delta = ""
    logging.debug(f"chunk: {content_delta}")
    return ChatResponse(text=content_delta, display=None)


async def generate_chunk(
        completion: AsyncStream[ChatCompletionChunk]
) -> AsyncGenerator[ChatResponse, None]:
    async for completion_delta in completion:
        content_delta = process_delta(completion_delta)
        yield content_delta


class StreamGPTClient(GPTClient):
    async def generate_response(self) -> AsyncGenerator[ChatResponse, None]:
        try:
            logging.info(f"messages: {self.messages}")
            completion = await self.client.chat.completions.create(
                messages=serialize(self.messages),
                model=self.model,
                temperature=self.temperature,
                stream=True
            )

            return generate_chunk(completion)

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
