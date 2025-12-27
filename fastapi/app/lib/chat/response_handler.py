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
    cost = await reduce_credit(chat_response.input_tokens, chat_response.output_tokens)

    logging.info(f"content: {chat_response}")
    logging.info(f"cost: {cost}")

    return chat_response


async def stream_handler(
        generator: ChunkGenerator,
        reduce_credit: ReduceCredit
) -> StreamingResponse:
    async def wrapper_generator() -> AsyncGenerator[str, None]:
        text = ""
        thought = ""
        code = ""
        code_output = ""
        files = []
        display = ""
        input_tokens = 0
        output_tokens = 0

        try:
            async for chunk in generator:
                logging.info(f"chunk: {str(chunk)}")

                if chunk.text:
                    text += chunk.text
                if chunk.thought:
                    thought += chunk.thought
                if chunk.code:
                    code += chunk.code
                if chunk.code_output:
                    code_output += chunk.code_output
                if chunk.files:
                    files += chunk.files
                if chunk.display:
                    display += chunk.display
                if chunk.input_tokens:
                    input_tokens = chunk.input_tokens
                if chunk.output_tokens:
                    output_tokens += chunk.output_tokens

                yield f"data: {json.dumps(serialize(chunk))}\n\n"

            chat_response = ChatResponse(
                text=text,
                thought=thought,
                code=code,
                code_output=code_output,
                files=files,
                display=display,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            )

            cost = await reduce_credit(input_tokens, output_tokens)

            logging.info(f"content: {chat_response}")
            logging.info(f"cost: {cost}")

        except Exception as e:
            logging.exception(f"Error in stream_handler: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(wrapper_generator(), media_type='text/event-stream')
