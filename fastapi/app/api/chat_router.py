from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

import app.dao.user_dao as user_dao
import app.logic.auth as auth
import app.logic.chat.util.chat_pricing as pricing
from app.logic.chat.chat_service import handle_chat_interaction
from chat import Message

chat_router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


@chat_router.post("/chat")
async def generate(chat_request: ChatRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    return await handle_chat_interaction(
        username=username,
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
    )


@chat_router.get("/chat")
async def get_models() -> list[dict]:
    return pricing.chat_prices
