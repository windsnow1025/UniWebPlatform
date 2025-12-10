import logging
import os
from typing import AsyncGenerator

from llm_bridge import *
from starlette.responses import StreamingResponse

from app.lib.chat import response_handler
from app.lib.user import user_logic


async def handle_chat_interaction(
        token: str,
        user_id: str,
        messages: list[Message],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        thought: bool,
        code_execution: bool,
        structured_output_schema: dict | None,
):
    logging.info(f"User ID: {user_id}, Model: {model}")

    await preprocess_messages(messages, api_type)

    async def reduce_credit(input_tokens: int, output_tokens: int) -> float:
        cost = calculate_chat_cost(
            api_type=api_type,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
        )
        await user_logic.reduce_credit(cost, token)
        return cost

    api_keys = {
        "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY"),
        "AZURE_API_KEY": os.environ.get("AZURE_API_KEY"),
        "AZURE_API_BASE": os.environ.get("AZURE_API_BASE"),
        "GITHUB_API_KEY": os.environ.get("GITHUB_API_KEY"),
        "GEMINI_FREE_API_KEY": os.environ.get("GEMINI_FREE_API_KEY"),
        "GEMINI_PAID_API_KEY": os.environ.get("GEMINI_PAID_API_KEY"),
        "GEMINI_VERTEX_API_KEY": os.environ.get("GEMINI_VERTEX_API_KEY"),
        "ANTHROPIC_API_KEY": os.environ.get("ANTHROPIC_API_KEY"),
        "XAI_API_KEY": os.environ.get("XAI_API_KEY"),
    }

    chat_client = await create_chat_client(
        api_keys=api_keys,
        messages=messages,
        model=model,
        api_type=api_type,
        temperature=temperature,
        stream=stream,
        thought=thought,
        code_execution=code_execution,
        structured_output_schema=structured_output_schema,
    )

    if stream:
        response = chat_client.generate_stream_response()
        async def final_response_handler(
                generator: AsyncGenerator[ChatResponse, None]
        ) -> StreamingResponse:
            return await response_handler.stream_handler(
                generator, reduce_credit
            )
    else:
        response = await chat_client.generate_non_stream_response()
        async def final_response_handler(
                content: ChatResponse
        ) -> ChatResponse:
            return await response_handler.non_stream_handler(
                content, reduce_credit
            )

    return await final_response_handler(response)
