import PIL.Image

from app.logic.chat.processor.factory.model_processor_factory.image_processor import fetch_img_data


async def get_image_parts_from_files(files: list[str]):
    return [await get_image_part_from_file(file) for file in files]


async def get_image_part_from_file(file: str):
    image_data = await fetch_img_data(file)
    return PIL.Image.open(image_data)

