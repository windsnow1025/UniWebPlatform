import base64

from app.logic.chat.processor.file_processor.image_processor import fetch_img_data
from app.model.gpt_message import ImageURL, ImageContent


async def get_image_content_from_file(file: str) -> ImageContent:
    img_data = await fetch_img_data(file)
    base64_image = base64.b64encode(img_data.getvalue()).decode('utf-8')
    image_url = ImageURL(url=f"data:image/jpeg;base64,{base64_image}")
    return ImageContent(type="image_url", image_url=image_url)
