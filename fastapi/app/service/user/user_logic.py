import logging

import httpcore
import httpx
from fastapi import HTTPException

from app.client.nest_js_client.models import UserResDto
from app.service.user import user_client


async def get_user(token: str) -> UserResDto:
    try:
        return await user_client.get_user(token)
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while fetching users: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while fetching users: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)


async def reduce_credit(token: str, cost: float) -> float:
    try:
        user_res_dto: UserResDto = await user_client.reduce_user_credit(token, cost)
        return user_res_dto.credit
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while fetching users: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while fetching users: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)

