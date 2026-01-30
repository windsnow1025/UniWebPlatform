from fastapi import HTTPException

from ...client.nest_js_client.api.users.users_controller_find import asyncio as find_async
from ...client.nest_js_client.api.users.users_controller_reduce_credit import asyncio as reduce_credit_async
from ...client.nest_js_client.errors import UnexpectedStatus
from ...client.nest_js_client.models import UserResDto
from ...client.nest_js_client.models.reduce_credit_req_dto import ReduceCreditReqDto
from ...config import get_client


async def get_user(token: str) -> UserResDto:
    client = get_client(token)
    try:
        async with client as client:
            return await find_async(client=client)
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))


async def reduce_user_credit(amount: float, token: str) -> UserResDto:
    client = get_client(token)
    try:
        async with client as client:
            return await reduce_credit_async(client=client, body=ReduceCreditReqDto(amount=amount))
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))
