from app.logic.chat.processor.file_processor.document_processor import \
    extract_text_from_file
from app.logic.chat.processor.file_processor.file_type_checker import get_file_type
from app.model.message import Message


async def preprocess_message(message: Message) -> None:
    for i, file in enumerate(message.files[::-1]):
        if get_file_type(file) == "image":
            continue
        file_text = await extract_text_from_file(file)
        message.text = f"{file}: \n{file_text}\n{message.text}"
        del message.files[len(message.files) - 1 - i]
