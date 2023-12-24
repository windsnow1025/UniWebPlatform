import logging
import os
from typing import Callable, Generator

from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from jose import jwt
from pydantic import BaseModel

from app.completion import ChatCompletionFactory
from app.config import init_environment
from app.dao.user_dao import select_credit, update_credit
from app.util.pricing import calculate_cost

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

init_environment()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    messages: list[dict[str, str]]
    model: str
    api_type: str
    temperature: float
    stream: bool


def get_username(authorization: str = Header(...)) -> str:
    if not authorization:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(authorization, os.environ["JWT_SECRET"], algorithms=["HS256"])
        username = payload.get("sub")
        return username
    except jwt.JWTError:
        raise HTTPException(status_code=403)


def fastapi_response_handler(generator_function: Callable[[], Generator[str, None, None]]) -> StreamingResponse:
    return StreamingResponse(generator_function(), media_type='text/plain')


@app.post("/")
async def generate(chat_request: ChatRequest, username: str = Depends(get_username)):
    credit = select_credit(username)
    if credit <= 0:
        return f"Insufficient credit for {username}. Please contact author \"windsnow1024@gmail.com\" to recharge."

    logging.info(f"username: {username}, model: {chat_request.model}")

    prompt_tokens = sum(len(message.get('content')) for message in chat_request.messages)
    credit -= calculate_cost(chat_request.api_type, chat_request.model, prompt_tokens, 0)
    update_credit(username, credit)

    factory = ChatCompletionFactory(
        messages=chat_request.messages,
        model=chat_request.model,
        api_type=chat_request.api_type,
        temperature=chat_request.temperature,
        stream=chat_request.stream,
        response_handler=fastapi_response_handler
    )
    completion = factory.create_chat_completion()
    response = completion.process_request()

    return response


class ModelList(BaseModel):
    open_ai_models: list[str]
    azure_models: list[str]


open_ai_models = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-0613",
    "gpt-4-1106-preview",
    "gpt-4-vision-preview"
]
azure_models = [
    "gpt-35-turbo",
    "gpt-35-turbo-16k",
    "gpt-4",
    "gpt-4-32k"
]


@app.get("/", response_model=ModelList)
async def get_models() -> ModelList:
    return ModelList(open_ai_models=open_ai_models, azure_models=azure_models)

