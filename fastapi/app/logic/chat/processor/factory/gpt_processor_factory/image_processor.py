import base64
from io import BytesIO

import httpx
from fastapi import HTTPException

from app.model.gpt_message import ImageURL, ImageContent


async def get_image_contents_from_files(files: list[str]) -> list[ImageContent]:
    image_urls = [await get_image_url_from_file(file) for file in files]
    return [ImageContent(type="image_url", image_url=image_url) for image_url in image_urls]


async def get_image_url_from_file(file: str) -> ImageURL:
    base64_image = await encode_image_from_url(file)
    return ImageURL(url=f"data:image/jpeg;base64,{base64_image}")


async def encode_image_from_url(img_url: str) -> str:
    img_data = await fetch_img_data(img_url)
    return base64.b64encode(img_data.getvalue()).decode('utf-8')


async def fetch_img_data(img_url: str) -> BytesIO:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        return BytesIO(response.content)
