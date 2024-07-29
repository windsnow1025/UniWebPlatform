from chat.logic.document_processor import extract_text_from_file
from chat.logic.file_type_checker import get_file_type
from chat.model.message import Message


async def preprocess_messages(messages: list[Message],) -> None:
    for message in messages:
        await preprocess_message(message)


async def preprocess_message(message: Message) -> None:
    await extract_text_files_to_message(message)


async def extract_text_files_to_message(message: Message) -> None:
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


def extract_system_messages(messages: list[Message]) -> str:
    system_message = ""
    indices_to_delete = []
    for i, message in enumerate(messages):
        if message.role != "system":
            continue
        system_message += f"{message.text}\n"
        indices_to_delete.append(i)

    for index in sorted(indices_to_delete):
        del messages[index]

    # Required for Claude
    if system_message == "":
        system_message = " "

    return system_message
