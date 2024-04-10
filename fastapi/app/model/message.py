from typing import TypedDict


class ImageURL(TypedDict):
    url: str


class TextContent(TypedDict):
    type: str
    text: str


class ImageContent(TypedDict):
    type: str
    image_url: ImageURL


class Message(TypedDict):
    role: str
    content: str | list[TextContent | ImageContent]
