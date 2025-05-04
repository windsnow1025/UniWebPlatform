import json
import logging
from collections.abc import AsyncGenerator
from typing import Callable, Awaitable

from fastapi.responses import StreamingResponse
from llm_bridge import *

ChunkGenerator = AsyncGenerator[ChatResponse, None]
ReduceCredit = Callable[[int, int], Awaitable[float]]


async def non_stream_handler(
        chat_response: ChatResponse,
        reduce_credit: ReduceCredit
) -> ChatResponse:
    await reduce_credit(chat_response.input_tokens, chat_response.output_tokens)

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
        input_tokens = 0
        output_tokens = 0

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
                if chunk.input_tokens:
                    input_tokens = chunk.input_tokens
                if chunk.output_tokens:
                    output_tokens += chunk.output_tokens
                yield f"data: {json.dumps(serialize(chunk))}\n\n"

            chat_response = ChatResponse(
                text=text,
                image=image,
                display=display,
                citations=citations,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            )

            await reduce_credit(input_tokens, output_tokens)

            logging.info(f"content: {str(chat_response)}")

        except Exception as e:
            logging.exception("Error in stream_handler")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(wrapper_generator(), media_type='text/event-stream')
