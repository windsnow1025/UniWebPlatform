import json
import logging
from collections.abc import AsyncGenerator
from typing import Callable, Awaitable

from fastapi.responses import StreamingResponse
from llm_bridge import *

from app.logic.chat.util.token_counter import num_tokens_from_text

ChunkGenerator = AsyncGenerator[ChatResponse, None]
ReduceCredit = Callable[[int, int], Awaitable[float]]


async def non_stream_handler(
        chat_response: ChatResponse,
        reduce_credit: ReduceCredit
) -> ChatResponse:
    output_tokens = num_tokens_from_text(chat_response.text)
    await reduce_credit(0, output_tokens)

    logging.info(f"content: {chat_response}")

    return chat_response


async def stream_handler(
        generator: ChunkGenerator,
        reduce_credit: ReduceCredit
) -> StreamingResponse:
    async def wrapper_generator() -> AsyncGenerator[str, None]:
        text = ""
        image = ""
        display = ""
        citations = []

        try:
            async for chunk in generator:
                logging.info(f"chunk: {str(chunk)}")
                if chunk.text:
                    text += chunk.text
                if chunk.image:
                    image += chunk.image
                if chunk.display:
                    display += chunk.display
                if chunk.citations:
                    citations += chunk.citations
                yield f"data: {json.dumps(serialize(chunk))}\n\n"

            chat_response = ChatResponse(text=text, image=image, display=display, citations=citations)

            output_tokens = calculate_token_count(chat_response)
            await reduce_credit(0, output_tokens)

            logging.info(f"content: {str(chat_response)}")

        except Exception as e:
            logging.exception("Error in stream_handler")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(wrapper_generator(), media_type='text/event-stream')


def calculate_token_count(chat_response: ChatResponse) -> int:
    text = chat_response.text
    file_count = 1 if chat_response.image else 0

    return num_tokens_from_text(text) + file_count * 1000
