import base64

from app.logic.chat.processor.factory.model_processor_factory.image_processor import fetch_img_data
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



