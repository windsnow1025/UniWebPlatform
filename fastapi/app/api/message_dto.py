import os
import re
from dataclasses import dataclass
from typing import List

from chat.model.message import Message, FileUrl


# role: "user" || "assistant" || "system"
@dataclass
class MessageDto:
    role: str
    text: str
    files: List[str]


def convert_message_dtos_to_messages(message_dtos: List[MessageDto]) -> List[Message]:
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
    return re.sub(
        r'https?://[^/]+/(?:minio/)?uploads/(\S+)',
        rf'http://{os.environ["MINIO_HOST"]}:9000/uploads/\1',
        external_url
    )
