from app.client.nest_js_client.models import UserResDto
from app.logic.user import user_client


async def get_user(token: str = None) -> UserResDto:
    return await user_client.get_user(token)


async def reduce_credit(cost: float, token: str = None) -> float:
    user_res_dto = await user_client.reduce_user_credit(cost, token)
    return user_res_dto.credit
