from dataclasses import dataclass
from typing import Optional


@dataclass
class ChatResponse:
    text: Optional[str] = None
    display: Optional[str] = None
    error: Optional[str] = None
