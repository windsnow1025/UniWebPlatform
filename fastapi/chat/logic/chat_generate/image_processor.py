import base64
from io import BytesIO

import httpx
from fastapi import HTTPException

from chat.model import gpt_message, claude_message


async def get_gpt_image_content_from_url(req_img_url: str) -> gpt_message.ImageContent:
    img_data, media_type = await fetch_img_data(req_img_url)
    base64_image = base64.b64encode(img_data.getvalue()).decode('utf-8')
    res_img_url = gpt_message.ImageURL(url=f"data:{media_type};base64,{base64_image}")
    return gpt_message.ImageContent(type="image_url", image_url=res_img_url)

from google.genai import types

async def get_gemini_image_part_from_url(req_img_url: str) -> types.Part:
    img_data, media_type = await fetch_img_data(req_img_url)
    img_bytes = img_data.getvalue()
    return types.Part.from_bytes(data=img_bytes, mime_type=media_type)

async def get_claude_image_content_from_url(req_img_url: str) -> claude_message.ImageContent:
    img_data, media_type = await fetch_img_data(req_img_url)
    base64_image = base64.b64encode(img_data.getvalue()).decode('utf-8')
    image_source = claude_message.ImageSource(type="base64", media_type=media_type, data=base64_image)
    return claude_message.ImageContent(type="image", source=image_source)


async def fetch_img_data(img_url: str) -> tuple[BytesIO, str]:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        content_type = response.headers.get("Content-Type", "image/jpeg")
        return BytesIO(response.content), content_type