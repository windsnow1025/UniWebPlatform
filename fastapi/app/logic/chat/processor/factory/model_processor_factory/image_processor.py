from io import BytesIO

import httpx
from fastapi import HTTPException


async def fetch_img_data(img_url: str) -> BytesIO:
    async with httpx.AsyncClient() as client:
        response = await client.get(img_url)

        if response.status_code != 200:
            status_code = response.status_code
            text = response.text
            raise HTTPException(status_code=status_code, detail=text)

        return BytesIO(response.content)
