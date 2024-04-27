from fastapi import APIRouter, Request
from pydantic import BaseModel

import app.dao.user_dao as user_dao
import app.logic.auth as auth
from app.logic.image_gen.image_gen_service import *

image_gen_router = APIRouter()


class ImageGenRequest(BaseModel):
    prompt: str
    model: str
    size: Size
    quality: Quality
    n: int


@image_gen_router.post("/image-gen")
async def generate(chat_request: ImageGenRequest, request: Request):
    authorization_header = request.headers.get("Authorization")
    username = auth.get_username_from_token(authorization_header)

    if user_dao.select_credit(username) <= 0:
        raise HTTPException(status_code=402)

    return await handle_image_gen_interaction(
        username=username,
        prompt=chat_request.prompt,
        model=chat_request.model,
        size=chat_request.size,
        quality=chat_request.quality,
        n=chat_request.n,
    )
