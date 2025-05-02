import logging
import os
from typing import AsyncGenerator

from llm_bridge import *
from starlette.responses import StreamingResponse

from app.logic.chat.handler import request_handler
from app.logic.chat.handler import response_handler
from app.logic.chat.util import model_pricing
from app.client import user_logic


async def handle_chat_interaction(
        token: str,
        username: str,
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
):
    logging.info(f"username: {username}, model: {model}")

    await preprocess_messages(messages)

    async def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
        cost = model_pricing.calculate_chat_cost(
            api_type=api_type,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens
        )
        await user_logic.reduce_credit(cost, token)
        return cost

    async def reduce_prompt_credit(prompt_tokens: int) -> float:
        return await reduce_credit(prompt_tokens, 0)

    async def reduce_completion_credit(completion_tokens: int) -> float:
        return await reduce_credit(0, completion_tokens)

    await request_handler.handle_request(
        messages, reduce_prompt_credit
    )

    api_keys = {
        "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY"),
        "AZURE_API_KEY": os.environ.get("AZURE_API_KEY"),
        "AZURE_API_BASE": os.environ.get("AZURE_API_BASE"),
        "GITHUB_API_KEY": os.environ.get("GITHUB_API_KEY"),
        "GEMINI_FREE_API_KEY": os.environ.get("GEMINI_FREE_API_KEY"),
        "GEMINI_PAID_API_KEY": os.environ.get("GEMINI_PAID_API_KEY"),
        "ANTHROPIC_API_KEY": os.environ.get("ANTHROPIC_API_KEY"),
        "XAI_API_KEY": os.environ.get("XAI_API_KEY"),
    }

    chat_client = await create_chat_client(
        messages=messages,
        model=model,
        api_type=api_type,
        temperature=temperature,
        stream=stream,
        api_keys=api_keys,
    )

    if stream:
        response = chat_client.generate_stream_response()
        async def final_response_handler(
                generator: AsyncGenerator[ChatResponse, None]
        ) -> StreamingResponse:
            return await response_handler.stream_handler(
                generator, reduce_prompt_credit
            )
    else:
        response = await chat_client.generate_non_stream_response()
        async def final_response_handler(
                content: ChatResponse
        ) -> ChatResponse:
            return await response_handler.non_stream_handler(
                content, reduce_completion_credit
            )

    return await final_response_handler(response)
