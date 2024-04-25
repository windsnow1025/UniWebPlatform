from dataclasses import dataclass


@dataclass
class ImageURL:
    url: str


# type: "text"
@dataclass
class TextContent:
    type: str
    text: str


# role: "image_url"
@dataclass
class ImageContent:
    type: str
    image_url: ImageURL


# role: user || assistant || system
@dataclass
class GptMessage:
    role: str
    content: str | list[TextContent | ImageContent]
