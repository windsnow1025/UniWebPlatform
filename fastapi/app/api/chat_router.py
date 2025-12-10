import logging

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from llm_bridge import Message, get_model_prices, ModelPrice, find_model_prices
from pydantic import BaseModel
from typing import Any, Optional

import app.logic.auth as auth
from app.logic.chat.chat_service import handle_chat_interaction
from app.logic.user import user_logic

chat_router = APIRouter()
security = HTTPBearer()


class ChatRequest(BaseModel):
    messages: list[Message]
    api_type: str
    model: str
    temperature: float
    stream: bool
    thought: bool
    code_execution: bool
    structured_output_schema: Optional[dict[str, Any]] = None


@chat_router.post("/chat")
async def generate(
        chat_request: ChatRequest,
        credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        token = credentials.credentials
        user_id = auth.get_user_id_from_token(token)

        if find_model_prices(chat_request.api_type, chat_request.model) is None:
            raise HTTPException(status_code=400, detail="Invalid API Type and Model combination")

        user = await user_logic.get_user(token)
        if not user.email_verified:
            raise HTTPException(status_code=401, detail="Email not verified")
        if user.credit <= 0:
            raise HTTPException(status_code=402, detail="Insufficient credit")

        return await handle_chat_interaction(
            token=token,
            user_id=user_id,
            messages=chat_request.messages,
            model=chat_request.model,
            api_type=chat_request.api_type,
            temperature=chat_request.temperature,
            stream=chat_request.stream,
            thought=chat_request.thought,
            code_execution=chat_request.code_execution,
            structured_output_schema=chat_request.structured_output_schema,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/model")
async def get_models() -> list[ModelPrice]:
    return get_model_prices()
