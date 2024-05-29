import mimetypes

from app.logic.chat.processor.factory.model_processor_factory.file_processor.code_file_extensions import \
    code_file_extensions


def get_file_type(file_name: str) -> str:
    if file_name.endswith(('.docx', '.doc')):
        return 'word'
    if file_name.endswith('.pdf'):
        return 'pdf'
    if file_name.endswith(code_file_extensions):
        return 'code'
    mime_type, _ = mimetypes.guess_type(file_name)
    if mime_type:
        if mime_type.startswith('application'):
            return mime_type.split('/')[1]
        else:
            return mime_type.split('/')[0]
    return 'unknown'
