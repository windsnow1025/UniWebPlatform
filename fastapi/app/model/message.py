from dataclasses import dataclass
from typing import Literal


@dataclass
class ImageURL:
    url: str


@dataclass
class TextContent:
    type: Literal['text']
    text: str


@dataclass
class ImageContent:
    type: Literal['image_url']
    image_url: ImageURL


@dataclass
class Message:
    role: str
    content: str | list[TextContent | ImageContent]


@dataclass
class GeminiMessage:
    role: str
    parts: list[str]
