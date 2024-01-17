from pydantic import BaseModel


class TextContent(BaseModel):
    type: str
    text: str


class ImageContent(BaseModel):
    type: str
    image_url: str


class Message(BaseModel):
    role: str
    content: str | list[TextContent | ImageContent]
