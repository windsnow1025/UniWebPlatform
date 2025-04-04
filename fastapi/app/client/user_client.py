import logging
import os

import httpx
import httpcore
from fastapi import HTTPException
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=4),
    retry=retry_if_exception_type((httpx.ConnectError, httpcore.ConnectError)),
    reraise=True,
)
async def get_user(token: str = None) -> dict:

    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{os.environ.get("NEST_API_BASE_URL")}/users/user", headers=headers)
        except httpx.ConnectError as e:
            logging.exception(f"httpx.ConnectError while fetching users: {e}")
            raise
        except httpcore.ConnectError as e:
            logging.exception(f"httpcore.ConnectError while fetching users: {e}")
            raise
        except Exception as e:
            logging.exception(f"Unknown error while fetching users: {e}")
            raise e

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            logging.error(f"Error {status_code}: {text}")
            raise HTTPException(status_code=status_code, detail=text)

        return response.json()


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=4),
    retry=retry_if_exception_type((httpx.ConnectError, httpcore.ConnectError)),
    reraise=True,
)
async def reduce_user_credit(amount: float, token: str = None) -> dict:

    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(
                f"{os.environ.get("NEST_API_BASE_URL")}/users/user/reduce-credit",
                json={"amount": amount},
                headers=headers
            )
        except httpx.ConnectError as e:
            logging.exception(f"httpx.ConnectError while reducing credit: {e}")
            raise
        except httpcore.ConnectError as e:
            logging.exception(f"httpcore.ConnectError while reducing credit: {e}")
            raise
        except Exception as e:
            logging.exception(f"Unknown error while reducing credit: {e}")
            raise e

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            logging.error(f"Error {status_code}: {text}")
            raise HTTPException(status_code=status_code, detail=text)

        return response.json()
