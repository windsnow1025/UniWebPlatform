from google.genai import types

from chat.logic.chat_generate import image_processor
from chat.logic.message_preprocess.file_type_checker import get_file_type
from chat.type.model_message.gemini_message import GeminiMessage
from chat.type.message import Message, Role


async def convert_message_to_gemini(message: Message) -> GeminiMessage:
    role = message.role
    text = message.text
    file_urls = message.file_urls

    if role == Role.System:
        role = Role.User

    parts = [types.Part.from_text(text)]

    for file_url in file_urls:
        if get_file_type(file_url) == "image":
            img_bytes, media_type = await image_processor.get_gemini_image_content_from_url(file_url)
            parts.append(types.Part.from_bytes(data=img_bytes, mime_type=media_type))

    return GeminiMessage(parts=parts, role=role)
