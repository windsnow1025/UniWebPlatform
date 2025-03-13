import openai
from fastapi import HTTPException
from openai import OpenAI

from app.logic.image_gen.image_gen_parameter import Size, Quality


def generate_image(
        prompt: str,
        model: str,
        size: Size,
        quality: Quality,
        n: int,
) -> list[str]:
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
