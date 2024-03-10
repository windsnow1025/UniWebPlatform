from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

import app.dao.user_dao as user_dao
import app.logic.auth as auth
import app.util.pricing as pricing
from app.logic.completion.chat_completion import ChatCompletionFactory
from app.model.message import Message

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


from app.logic.completion.request_handler import handle_request
from app.logic.completion.response_handler import non_stream_handler, stream_handler


@router.post("/")
async def generate(chat_request: ChatRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    handle_request(username, chat_request)

    factory = ChatCompletionFactory(
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
        non_stream_handler=lambda content: non_stream_handler(content, username, chat_request),
        stream_handler=lambda generator_function: stream_handler(generator_function, username, chat_request)
    )
    completion = factory.create_chat_completion()
    response = completion.process_request()

    return response


@router.get("/")
async def get_models() -> list[dict]:
    return pricing.model_pricing_data
