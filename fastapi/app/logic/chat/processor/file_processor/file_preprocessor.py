from app.logic.chat.processor.file_processor.document_processor import extract_text_from_file
from app.logic.chat.processor.file_processor.file_type_checker import get_file_type
from app.model.message import Message


async def preprocess_message(message: Message) -> None:
    indices_to_delete = []
    for i, file in enumerate(message.files[::-1]):
        if get_file_type(file) == "image":
            continue
        filename = file.split('-', 1)[1]
        file_text = await extract_text_from_file(file)
        message.text = f"{filename}: \n{file_text}\n{message.text}"
        indices_to_delete.append(len(message.files) - 1 - i)

    for index in sorted(indices_to_delete, reverse=True):
        del message.files[index]
