from pydantic import BaseModel


class User(BaseModel):
    id: int = None
    username: str
    email_verified: bool = False
    credit: float = 0.0 