import os
import re
from dataclasses import dataclass

from chat import Role, Message


@dataclass
class MessageDto:
    role: Role
    text: str
    files: list[str]


def convert_message_dtos_to_messages(message_dtos: list[MessageDto]) -> list[Message]:
    messages = []
    for message_dto in message_dtos:
        file_urls = []
        for file in message_dto.files:
            file_urls.append(get_internal_url(file))
        messages.append(Message(
            message_dto.role,
            message_dto.text,
            file_urls,
        ))
    return messages


def get_internal_url(external_url: str) -> str:
    minio_host = os.environ.get("MINIO_HOST")
    minio_bucket_name = os.environ.get("MINIO_BUCKET_NAME")

    return re.sub(
        r'https?://[^/]+/(?:minio/)?' + re.escape(minio_bucket_name) + r'/uploads/(\S+)',
        rf'http://{minio_host}:9000/{minio_bucket_name}/uploads/\1',
        external_url
    )
