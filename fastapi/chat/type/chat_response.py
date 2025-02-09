from dataclasses import dataclass
from typing import Optional


@dataclass
class Citation:
    text: str
    indices: list[int]


@dataclass
class ChatResponse:
    text: Optional[str] = None
    display: Optional[str] = None
    citations: Optional[list[Citation]] = None
    error: Optional[str] = None
