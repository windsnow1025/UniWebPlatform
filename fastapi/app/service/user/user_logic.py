from app.client.nest_js_client.models import UserResDto
from app.service.user import user_client


async def get_user(token: str) -> UserResDto:
    return await user_client.get_user(token)


async def reduce_credit(token: str, cost: float) -> float:
    user_res_dto: UserResDto = await user_client.reduce_user_credit(token, cost)
    return user_res_dto.credit
