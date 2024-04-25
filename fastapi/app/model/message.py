from dataclasses import dataclass


# role: "user" || "assistant" || "system"
@dataclass
class Message:
    role: str
    text: str
    files: list[str]
