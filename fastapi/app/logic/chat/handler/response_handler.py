import json
import logging
from collections.abc import AsyncGenerator
from typing import Callable, Awaitable

from fastapi.responses import StreamingResponse
from llm_bridge import *

from app.logic.chat.util.token_counter import num_tokens_from_text

ChunkGenerator = AsyncGenerator[ChatResponse, None]
ReduceCredit = Callable[[int], Awaitable[float]]


async def non_stream_handler(
        chat_response: ChatResponse,
        reduce_credit: ReduceCredit
) -> ChatResponse:
    # Credit
    completion_tokens = num_tokens_from_text(chat_response.text)
    await reduce_credit(completion_tokens)

    # Logging
    logging.info(f"content: {chat_response}")

    return chat_response


async def stream_handler(
        generator: ChunkGenerator,
        reduce_credit: ReduceCredit
) -> StreamingResponse:
    async def wrapper_generator() -> AsyncGenerator[str, None]:
        text = ""
        display = ""
        citations = []

        try:
            async for chunk in generator:
                if chunk.text:
                    text += chunk.text
                if chunk.display:
                    display += chunk.display
                if chunk.citations:
                    citations += chunk.citations
                yield f"data: {json.dumps(serialize(chunk))}\n\n"

            # Credit
            completion_tokens = num_tokens_from_text(text)
            await reduce_credit(completion_tokens)

            # Logging
            chat_response = ChatResponse(text=text, display=display, citations=citations)
            logging.info(f"content: {str(chat_response)}")

        except Exception as e:
            logging.exception("Error in stream_handler")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(wrapper_generator(), media_type='text/event-stream')
