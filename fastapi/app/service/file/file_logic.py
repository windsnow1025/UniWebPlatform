import base64

from llm_bridge import File

from app.service.file import file_client


async def get_storage_url(token: str) -> str:
    return await file_client.get_storage_url(token)


async def upload_files(token: str, files: list[tuple[str, bytes, str]]) -> list[str]:
    return await file_client.upload_files(token, files)


async def upload_base64_files(token: str, files: list[File]) -> list[str]:
    files_to_upload = [
        (file.name, base64.b64decode(file.data), file.type)
        for file in files
    ]
    return await upload_files(token, files_to_upload)
