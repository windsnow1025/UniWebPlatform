from fastapi import APIRouter, Request
from pydantic import BaseModel

import app.logic.auth as auth
from app.logic.image_gen.image_gen_service import *
from chat.logic.chat_generate.message_converter import *
from chat.model.message import Message

messages_convert_router = APIRouter()


class MessagesConvertRequest(BaseModel):
    messages: list[Message]
    api_type: str


@messages_convert_router.post("/messages/convert")
async def convert_messages(chat_request: MessagesConvertRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    messages = chat_request.messages
    api_type = chat_request.api_type

    if api_type == "open_ai":
        print(messages)
        return await convert_messages_to_gpt(messages)
    elif api_type == "gemini":
        return await convert_messages_to_gemini(messages)
