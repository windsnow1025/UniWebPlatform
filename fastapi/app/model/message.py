from typing import TypedDict, Literal


class ImageURL(TypedDict):
    url: str


class TextContent(TypedDict):
    type: Literal['text']
    text: str


class ImageContent(TypedDict):
    type: Literal['image_url']
    image_url: ImageURL


class Message(TypedDict):
    role: str
    content: str | list[TextContent | ImageContent]


class GeminiMessage(TypedDict):
    role: str
    parts: list[str]
