import httpx
from fastapi import HTTPException

from ...client.nest_js_client.api.files.files_controller_get_minio_web_url import asyncio as get_web_url_async
from ...client.nest_js_client.errors import UnexpectedStatus
from ...config import get_client


async def get_storage_url(token: str) -> str:
    client = get_client(token)
    try:
        async with client as client:
            result = await get_web_url_async(client=client)
            return result.web_url
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))


async def upload_files(token: str, files: list[tuple[str, bytes, str]]) -> list[str]:
    client = get_client(token)
    try:
        async with client as client:
            httpx_client = client.get_async_httpx_client()

            files_data = [
                ("files", (filename, file_bytes, mime_type))
                for filename, file_bytes, mime_type in files
            ]

            response = await httpx_client.post(
                "/files",
                files=files_data,
            )
            response.raise_for_status()

            return response.json()["urls"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))


