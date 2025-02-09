from dataclasses import dataclass
from typing import Optional


@dataclass
class ChatResponse:
    text: Optional[str]
    display: Optional[str]
    error: Optional[str]