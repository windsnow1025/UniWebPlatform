from fastapi import APIRouter, Request
from pydantic import BaseModel

from chat.logic.chat_generate.message_converter import *
from chat import Message

messages_convert_router = APIRouter()


class MessagesConvertRequest(BaseModel):
    messages: list[Message]
    api_type: str


@messages_convert_router.post("/messages/convert")
async def convert_messages(chat_request: MessagesConvertRequest):
    messages = chat_request.messages
    api_type = chat_request.api_type

    if api_type == "open_ai":
        return await convert_messages_to_gpt(messages)
    elif api_type == "gemini":
        return await convert_messages_to_gemini(messages)
    elif api_type == "claude":
        return await convert_messages_to_claude(messages)
