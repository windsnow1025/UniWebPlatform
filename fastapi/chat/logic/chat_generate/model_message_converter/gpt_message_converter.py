from chat.logic.chat_generate import media_processor
from chat.logic.message_preprocess.file_type_checker import get_file_type
from chat.type.model_message import gpt_message
from chat.type.model_message.gpt_message import GptMessage
from chat.type.message import Message


async def convert_message_to_gpt(message: Message) -> GptMessage:
    role = message.role
    text = message.text
    file_urls = message.file_urls

    content = []

    if text:
        text_content = gpt_message.TextContent(type="text", text=text)
        content.append(text_content)

    for file_url in file_urls:
        if get_file_type(file_url) == "image":
            image_contents = await media_processor.get_gpt_image_content_from_url(file_url)
            content.append(image_contents)

    return GptMessage(role=role, content=content)
