from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from repository.user_entity import User


async def select_user(username: str, session: AsyncSession) -> User:
    statement = select(User).where(User.username == username)
    result = await session.exec(statement)
    user = result.first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def reduce_credit(username: str, cost: float, session: AsyncSession) -> float:
    statement = select(User).where(User.username == username)
    result = await session.exec(statement)
    user = result.first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.credit -= cost
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user.credit
