import os

from fastapi import HTTPException
from jose import jwt


def get_user_id_from_token(token: str) -> str:
    if not token:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
        user_id = payload.get("sub")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=403)
