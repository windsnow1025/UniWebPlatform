import os

from fastapi import HTTPException
from jose import jwt


def get_user_id_from_token(authorization_header: str) -> str:
    if not authorization_header:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(authorization_header, os.environ["JWT_SECRET"], algorithms=["HS256"])
        user_id = payload.get("sub")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=403)
