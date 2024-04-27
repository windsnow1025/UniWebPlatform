from typing import Literal

import openai
from fastapi import HTTPException
from openai import OpenAI

Size = Literal["1024x1024", "1792x1024", "1024x1792"]
Quality = Literal["standard", "hd"]


async def handle_image_gen_interaction(
        username: str,
        prompt: str,
        model: str,
        size: Size,
        quality: Quality,
        n: int,
):
    client = OpenAI()

    try:
        response = client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
            n=n,
        )

        image_urls = [image.url for image in response.data]

        return image_urls
    except openai.BadRequestError as e:
        status_code = e.status_code
        text = e.message
        raise HTTPException(status_code=status_code, detail=text)
