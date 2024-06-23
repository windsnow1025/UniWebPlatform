import mimetypes

from chat.logic.code_file_extensions import code_file_extensions


def get_file_type(file_name: str) -> str:
    if file_name.endswith(code_file_extensions):
        return 'code'
    if file_name.endswith('.pdf'):
        return 'pdf'
    if file_name.endswith(('.docx', '.doc')):
        return 'word'
    if file_name.endswith(('.xlsx', '.xls')):
        return 'excel'
    if file_name.endswith(('.pptx', '.ppt')):
        return 'ppt'
    mime_type, _ = mimetypes.guess_type(file_name)
    if mime_type:
        if mime_type.startswith('application'):
            return mime_type.split('/')[1]
        else:
            return mime_type.split('/')[0]
    return 'unknown'
