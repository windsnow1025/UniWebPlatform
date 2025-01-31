from dataclasses import dataclass


@dataclass
class ChatResponse:
    text: str
    display: str