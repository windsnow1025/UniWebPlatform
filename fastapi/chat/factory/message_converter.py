from chat.factory.model_processor_factory.gemini_image_processor import get_image_part_from_file
from chat.factory.model_processor_factory.gpt_image_processor import get_image_content_from_file
from chat.logic.file_type_checker import get_file_type
from chat.model.claude_message import ClaudeMessage
from chat.model.gemini_message import GeminiMessage
from chat.model.gpt_message import GptMessage, TextContent
from chat.model.message import Message


async def convert_messages_to_gemini(messages: list[Message]) -> list[GeminiMessage]:
    return [await convert_message_to_gemini(message) for message in messages]


async def convert_messages_to_gpt(messages: list[Message]) -> list[GptMessage]:
    return [await convert_message_to_gpt(message) for message in messages]


async def convert_messages_to_claude(messages: list[Message]) -> list[ClaudeMessage]:
    return [await convert_message_to_claude(message) for message in messages]


async def convert_message_to_gemini(message: Message) -> GeminiMessage:
    role = message.role
    text = message.text
    files = message.files

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
        if get_file_type(file) == "image":
            image_contents = await get_image_part_from_file(file)
            parts.append(image_contents)

    return GeminiMessage(role=gemini_role, parts=parts)


async def convert_message_to_gpt(message: Message) -> GptMessage:
    role = message.role
    text = message.text
    files = message.files

    content = []

    if text:
        text_content = TextContent(type="text", text=text)
        content.append(text_content)

    for file in files:
        if get_file_type(file) == "image":
            image_contents = await get_image_content_from_file(file)
            content.append(image_contents)

    return GptMessage(role=role, content=content)


async def convert_message_to_claude(message: Message) -> ClaudeMessage:
    role = message.role
    text = message.text
    files = message.files

    claude_role = ""
    if role == "user" or role == "system":
        claude_role = "user"
    elif role == "assistant":
        claude_role = "assistant"

    return ClaudeMessage(role=claude_role, content=text)
