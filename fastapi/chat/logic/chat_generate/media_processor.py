import base64
from io import BytesIO

import httpx
from fastapi import HTTPException

from chat.type.model_message import gpt_message, claude_message


async def get_gpt_image_content_from_url(req_img_url: str) -> gpt_message.ImageContent:
    img_data, media_type = await fetch_media_data(req_img_url)
    base64_image = base64.b64encode(img_data.getvalue()).decode('utf-8')
    res_img_url = gpt_message.ImageURL(url=f"data:{media_type};base64,{base64_image}")
    return gpt_message.ImageContent(type="image_url", image_url=res_img_url)


async def get_gemini_image_content_from_url(req_img_url: str) -> tuple[bytes, str]:
    img_data, media_type = await fetch_media_data(req_img_url)
    img_bytes = img_data.getvalue()
    return img_bytes, media_type


async def get_claude_image_content_from_url(req_img_url: str) -> claude_message.ImageContent:
    img_data, media_type = await fetch_media_data(req_img_url)
    base64_image = base64.b64encode(img_data.getvalue()).decode('utf-8')
    image_source = claude_message.ImageSource(type="base64", media_type=media_type, data=base64_image)
    return claude_message.ImageContent(type="image", source=image_source)


async def get_gemini_audio_content_from_url(req_audio_url: str) -> tuple[bytes, str]:
    audio_data, media_type = await fetch_media_data(req_audio_url)
    audio_bytes = audio_data.getvalue()
    return audio_bytes, media_type


async def fetch_media_data(img_url: str) -> tuple[BytesIO, str]:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        content_type = response.headers.get("Content-Type")
        return BytesIO(response.content), content_type
