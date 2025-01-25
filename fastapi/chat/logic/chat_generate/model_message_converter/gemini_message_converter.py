from google.genai import types

from chat.logic.chat_generate import image_processor
from chat.logic.message_preprocess.file_type_checker import get_file_type
from chat.model.gemini_message import GeminiMessage
from chat.model.message import Message


async def convert_message_to_gemini(message: Message) -> GeminiMessage:
    role = message.role
    text = message.text
    file_urls = message.file_urls

    gemini_role = ""
    if role == "user" or role == "system":
        gemini_role = "user"
    elif role == "assistant":
        gemini_role = "model"

    parts = [types.Part.from_text(text)]

    for file_url in file_urls:
        if get_file_type(file_url) == "image":
            image_contents = await image_processor.get_gemini_image_part_from_url(file_url)
            parts.append(image_contents)

    return GeminiMessage(parts=parts, role=gemini_role)
