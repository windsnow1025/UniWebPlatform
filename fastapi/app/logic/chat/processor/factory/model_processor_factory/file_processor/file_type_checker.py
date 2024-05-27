def is_image_file(file: str) -> bool:
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp')
    return file.lower().endswith(image_extensions)
