from chat.logic.chat_generate import image_processor
from chat.logic.message_preprocess.file_type_checker import get_file_type
from chat.model import claude_message
from chat.model.claude_message import ClaudeMessage
from chat.model.message import Message, Role


async def convert_message_to_claude(message: Message) -> ClaudeMessage:
    role = message.role
    text = message.text
    file_urls = message.file_urls

    if role == Role.System:
        role = Role.User

    content = []

    if text:
        text_content = claude_message.TextContent(type="text", text=text)
        content.append(text_content)

    for file_url in file_urls:
        if get_file_type(file_url) == "image":
            image_contents = await image_processor.get_claude_image_content_from_url(file_url)
            content.append(image_contents)

    return ClaudeMessage(role=role, content=content)
