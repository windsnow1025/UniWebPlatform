import logging

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

import app.dao.user_dao as user_dao
import app.logic.auth as auth
import app.util.pricing as pricing
from app.logic.chat.chat_processor_factory import create_chat_processor
from app.logic.chat.request_handler import handle_request
from app.logic.chat.response_handler import non_stream_handler, stream_handler
from app.model.message import Message

chat_router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


@chat_router.post("/")
async def generate(chat_request: ChatRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    logging.info(f"username: {username}, model: {chat_request.model}")

    def reduce_credit(prompt_tokens: int, completion_tokens: int) -> None:
        user_dao.reduce_credit(
            username=username,
            cost=pricing.calculate_cost(
                api_type=chat_request.api_type,
                model=chat_request.model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
        )

    handle_request(
        chat_request.messages,
        lambda prompt_tokens: reduce_credit(prompt_tokens=prompt_tokens, completion_tokens=0)
    )

    processor = create_chat_processor(
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
        non_stream_handler=lambda content: non_stream_handler(
            content,
            lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
        ),
        stream_handler=lambda generator_function: stream_handler(
            generator_function,
            lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
        )
    )
    response = processor.process_request()

    return response


@chat_router.get("/")
async def get_models() -> list[dict]:
    return pricing.model_pricing_data
