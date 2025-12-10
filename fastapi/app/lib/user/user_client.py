from ...client.nest_js_client.api.users.users_controller_find_one import asyncio as find_one_async
from ...client.nest_js_client.api.users.users_controller_reduce_credit import asyncio as reduce_credit_async
from ...client.nest_js_client.models import UserResDto
from ...client.nest_js_client.models.reduce_credit_req_dto import ReduceCreditReqDto
from ...config import get_client


async def get_user(token: str = None) -> UserResDto:
    client = get_client(token)
    async with client as client:
        return await find_one_async(client=client)


async def reduce_user_credit(amount: float, token: str = None) -> UserResDto:
    client = get_client(token)
    async with client as client:
        return await reduce_credit_async(client=client, body=ReduceCreditReqDto(amount=amount))
