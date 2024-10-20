from dataclasses import dataclass
from typing import List


# role: "user" || "assistant" || "system"
@dataclass
class Message:
    role: str
    text: str
    file_urls: List[str]
