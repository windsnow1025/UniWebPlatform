import base64

from app.logic.chat.processor.factory.model_processor_factory.file_processor.image_processor import fetch_img_data
from app.model.gpt_message import ImageURL, ImageContent


async def get_image_content_from_file(file: str) -> ImageContent:
    base64_image = await encode_image_from_url(file)
    image_url = ImageURL(url=f"data:image/jpeg;base64,{base64_image}")
    return ImageContent(type="image_url", image_url=image_url)


async def get_image_url_from_file(file: str) -> ImageURL:
    base64_image = await encode_image_from_url(file)
    return ImageURL(url=f"data:image/jpeg;base64,{base64_image}")


async def encode_image_from_url(img_url: str) -> str:
    img_data = await fetch_img_data(img_url)
    return base64.b64encode(img_data.getvalue()).decode('utf-8')
