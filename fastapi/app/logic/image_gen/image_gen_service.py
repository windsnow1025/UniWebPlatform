from typing import Literal

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

    response = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        quality=quality,
        n=n,
    )

    image_urls = [image.url for image in response.data]

    return image_urls
