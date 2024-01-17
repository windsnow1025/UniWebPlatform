from typing import TypedDict


class TextContent(TypedDict):
    type: str
    text: str


class ImageContent(TypedDict):
    type: str
    image_url: str


class Message(TypedDict):
    role: str
    content: str | list[TextContent | ImageContent]
