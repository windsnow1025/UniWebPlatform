from fastapi import HTTPException
from sqlmodel import select, Session
from app.repository.user import User

def select_credit(username: str, session: Session) -> float:
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.credit

def reduce_credit(username: str, cost: float, session: Session) -> float:
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.credit -= cost
    session.add(user)
    session.commit()
    return user.credit
