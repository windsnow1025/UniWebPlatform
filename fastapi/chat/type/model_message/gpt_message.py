from dataclasses import dataclass

from chat.type.message import Role


@dataclass
class ImageURL:
    url: str


# type: "text"
@dataclass
class TextContent:
    type: str
    text: str


# type: "image_url"
@dataclass
class ImageContent:
    type: str
    image_url: ImageURL


@dataclass
class GptMessage:
    role: Role
    content: str | list[TextContent | ImageContent]
