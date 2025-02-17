from fastapi import APIRouter
from pydantic import BaseModel

from llm_bridge import *

messages_convert_router = APIRouter()


class MessagesConvertRequest(BaseModel):
    messages: list[Message]
    api_type: str


@messages_convert_router.post("/messages/convert")
async def convert_messages(chat_request: MessagesConvertRequest):
    messages = chat_request.messages
    api_type = chat_request.api_type

    if api_type == "OpenAI":
        return await convert_messages_to_gpt(messages)
    elif api_type == "Gemini":
        return await convert_messages_to_gemini(messages)
    elif api_type == "Claude":
        return await convert_messages_to_claude(messages)
