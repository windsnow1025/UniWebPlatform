import PIL.Image

from app.logic.chat.processor.file_processor.image_processor import fetch_img_data


async def get_image_part_from_file(file: str):
    image_data = await fetch_img_data(file)
    return PIL.Image.open(image_data)
