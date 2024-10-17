import logging

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

import app.logic.auth as auth
import app.logic.chat.util.model_pricing as pricing
import app.repository.user_dao as user_dao
from app.logic.chat.chat_service import handle_chat_interaction
from app.repository.db_connection import SessionDep
from chat import Message

chat_router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str
    api_type: str
    temperature: float
    stream: bool


@chat_router.post("/chat")
async def generate(chat_request: ChatRequest, request: Request, session: SessionDep):
    try:
        authorization_header = request.headers.get("Authorization")
        username = auth.get_username_from_token(authorization_header)

        if user_dao.select_credit(username, session) <= 0:
            raise HTTPException(status_code=402)

        return await handle_chat_interaction(
            session=session,
            username=username,
            messages=chat_request.messages,
            model=chat_request.model,
            api_type=chat_request.api_type,
            temperature=chat_request.temperature,
            stream=chat_request.stream,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/chat")
async def get_models() -> list[dict]:
    return pricing.load_model_prices()
