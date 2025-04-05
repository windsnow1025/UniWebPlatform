from app.client import user_client
from app.client.user_entity import User


async def select_user(token: str = None) -> User:
    user_data = await user_client.get_user(token)

    user = User(
        id=user_data.get("id"),
        username=user_data.get("username"),
        email_verified=user_data.get("emailVerified", False),
        credit=user_data.get("credit", 0.0),
    )
    
    return user


async def reduce_credit(cost: float, token: str = None) -> float:
    user_data = await user_client.reduce_user_credit(cost, token)
    return user_data.get("credit", 0.0)
