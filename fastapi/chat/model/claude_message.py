from dataclasses import dataclass


# type: "base64"
@dataclass
class ImageSource:
    type: str
    media_type: str
    data: str


# type: "text"
@dataclass
class TextContent:
    type: str
    text: str


# type: "image"
@dataclass
class ImageContent:
    type: str
    source: ImageSource


@dataclass
class ClaudeMessage:
    role: str
    content: str | list[TextContent | ImageContent]
