from typing import Literal

import openai
from fastapi import HTTPException
from openai import OpenAI

from app.dao import user_dao
from app.logic.image_gen.image_gen_pricing import calculate_image_gen_cost

Size = Literal["1024x1024", "1792x1024", "1024x1792"]
Quality = Literal["standard", "hd"]


async def handle_image_gen_interaction(
        username: str,
        prompt: str,
        model: str,
        size: Size,
        quality: Quality,
        n: int,
) -> list[str]:
    client = OpenAI()

    cost = calculate_image_gen_cost(model, quality, size, n)
    user_dao.reduce_credit(username, cost)

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

