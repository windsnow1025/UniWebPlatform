import base64
import logging

import httpcore
import httpx
from fastapi import HTTPException
from llm_bridge import File

from app.service.file import file_client


async def get_storage_url(token: str) -> str:
    try:
        return await file_client.get_storage_url(token)
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while getting storage URL: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while getting storage URL: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)


async def upload_files(token: str, files: list[tuple[str, bytes, str]]) -> list[str]:
    try:
        return await file_client.upload_files(token, files)
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while uploading files: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while uploading files: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)


async def upload_base64_files(token: str, files: list[File]) -> list[str]:
    files_to_upload = [
        (file.name, base64.b64decode(file.data), file.type)
        for file in files
    ]
    return await upload_files(token, files_to_upload)
