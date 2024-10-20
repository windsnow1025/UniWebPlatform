from dataclasses import dataclass
from typing import List


@dataclass
class FileUrl:
    external_url: str
    internal_url: str


# role: "user" || "assistant" || "system"
@dataclass
class Message:
    role: str
    text: str
    file_urls: List[FileUrl]
