from dataclasses import dataclass


@dataclass
class ClaudeMessage:
    role: str
    content: str
