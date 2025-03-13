from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

import logic.auth as auth
from logic.image_gen.image_gen_service import *
from repository.db_connection import SessionDep

image_gen_router = APIRouter()


class ImageGenRequest(BaseModel):
    prompt: str
    model: str
    size: Size
    quality: Quality
    n: int


@image_gen_router.post("/image-gen")
async def generate(chat_request: ImageGenRequest, request: Request, session: SessionDep):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if await user_repository.select_credit(username, session) <= 0:
        raise HTTPException(status_code=402)

    return await handle_image_gen_interaction(
        session=session,
        username=username,
        prompt=chat_request.prompt,
        model=chat_request.model,
        size=chat_request.size,
        quality=chat_request.quality,
        n=chat_request.n,
    )
