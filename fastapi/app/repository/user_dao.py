from sqlmodel import select

from app.repository.db_connection import DatabaseConnection
from app.repository.user import User


def select_credit(username: str) -> float:
    database_connection = DatabaseConnection.get_instance()
    with database_connection.get_session() as session:
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        return user.credit


def reduce_credit(username: str, cost: float) -> float:
    database_connection = DatabaseConnection.get_instance()
    with database_connection.get_session() as session:
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        user.credit -= cost
        session.add(user)
        session.commit()
        return user.credit
