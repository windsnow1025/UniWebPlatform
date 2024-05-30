import logging
from io import BytesIO

import docx
import fitz
import httpx
from fastapi import HTTPException

from app.logic.chat.processor.file_processor.file_type_checker import get_file_type


async def extract_text_from_file(file_url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(file_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        file_content = response.content

        if get_file_type(file_url) == "pdf":
            return extract_text_from_pdf(file_content)
        elif get_file_type(file_url) == "word":
            return extract_text_from_word(file_content)
        elif get_file_type(file_url) == "code":
            return extract_text_from_code(file_content)
        else:
            try:
                return file_content.decode('utf-8')
            except UnicodeDecodeError as e:
                logging.error(e)
                raise HTTPException(status_code=415)


def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    with fitz.open(stream=file_content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


def extract_text_from_word(file_content: bytes) -> str:
    text = ""
    try:
        doc = docx.Document(BytesIO(file_content))
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=415)


def extract_text_from_code(file_content: bytes) -> str:
    return file_content.decode('utf-8')
