from chat.logic.chat_generate import image_processor
from chat.logic.message_preprocess.file_type_checker import get_file_type
from chat.model import gpt_message, claude_message
from chat.model.claude_message import ClaudeMessage
from chat.model.gemini_message import GeminiMessage
from chat.model.gpt_message import GptMessage
from chat.model.message import Message


async def convert_messages_to_gemini(messages: list[Message]) -> list[GeminiMessage]:
    return [await convert_message_to_gemini(message) for message in messages]


async def convert_messages_to_gpt(messages: list[Message]) -> list[GptMessage]:
    return [await convert_message_to_gpt(message) for message in messages]


async def convert_messages_to_claude(messages: list[Message]) -> list[ClaudeMessage]:
    return [await convert_message_to_claude(message) for message in messages]


async def convert_message_to_gpt(message: Message) -> GptMessage:
    role = message.role
    text = message.text
    files = message.file_urls

    content = []

    if text:
        text_content = gpt_message.TextContent(type="text", text=text)
        content.append(text_content)

    for file in files:
        external_file_url = file.external_url
        if get_file_type(external_file_url) == "image":
            image_contents = await image_processor.get_gpt_image_content_from_url(external_file_url)
            content.append(image_contents)

    return GptMessage(role=role, content=content)


async def convert_message_to_gemini(message: Message) -> GeminiMessage:
    role = message.role
    text = message.text
    files = message.file_urls

    gemini_role = ""
    if role == "user" or role == "system":
        gemini_role = "user"
    elif role == "assistant":
        gemini_role = "model"

    parts = []

    if text:
        parts.append(text)
    else:
        parts.append("")

    for file in files:
        external_file_url = file.external_url
        if get_file_type(external_file_url) == "image":
            image_contents = await image_processor.get_gemini_image_part_from_url(external_file_url)
            parts.append(image_contents)

    return GeminiMessage(role=gemini_role, parts=parts)


async def convert_message_to_claude(message: Message) -> ClaudeMessage:
    role = message.role
    text = message.text
    files = message.file_urls

    claude_role = ""
    if role == "user" or role == "system":
        claude_role = "user"
    elif role == "assistant":
        claude_role = "assistant"

    content = []

    if text:
        text_content = claude_message.TextContent(type="text", text=text)
        content.append(text_content)

    for file in files:
        external_file_url = file.external_url
        if get_file_type(external_file_url) == "image":
            image_contents = await image_processor.get_claude_image_content_from_url(external_file_url)
            content.append(image_contents)

    return ClaudeMessage(role=claude_role, content=content)
