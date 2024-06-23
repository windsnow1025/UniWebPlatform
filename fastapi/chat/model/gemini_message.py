from dataclasses import dataclass

from PIL.Image import Image


# role: user || model
@dataclass
class GeminiMessage:
    role: str
    parts: list[str | Image]
