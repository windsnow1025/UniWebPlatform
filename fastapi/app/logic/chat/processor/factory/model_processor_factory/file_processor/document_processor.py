import httpx
import fitz  # PyMuPDF
import docx
from fastapi import HTTPException
from io import BytesIO


async def extract_text_from_file(file_url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(file_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        file_content = response.content
        file_extension = file_url.split('.')[-1].lower()

        if file_extension in ['pdf']:
            return extract_text_from_pdf(file_content)
        elif file_extension in ['doc', 'docx']:
            return extract_text_from_word(file_content)
        else:
            return file_content.decode('utf-8')


def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    with fitz.open(stream=file_content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


def extract_text_from_word(file_content: bytes) -> str:
    text = ""
    doc = docx.Document(BytesIO(file_content))
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text
