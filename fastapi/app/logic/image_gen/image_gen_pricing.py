image_gen_prices = [
    {
        "model": "dall-e-3",
        "quality": "standard",
        "resolution": "1024x1024",
        "price": 0.04
    },
    {
        "model": "dall-e-3",
        "quality": "standard",
        "resolution": "1792x1024",
        "price": 0.08
    },
    {
        "model": "dall-e-3",
        "quality": "standard",
        "resolution": "1024x1792",
        "price": 0.08
    },
    {
        "model": "dall-e-3",
        "quality": "hd",
        "resolution": "1024x1024",
        "price": 0.08
    },
    {
        "model": "dall-e-3",
        "quality": "hd",
        "resolution": "1792x1024",
        "price": 0.12
    },
    {
        "model": "dall-e-3",
        "quality": "hd",
        "resolution": "1024x1792",
        "price": 0.12
    },
]


def find_image_gen_prices(model: str, quality: str, resolution: str) -> float:
    for image_gen_price in image_gen_prices:
        if image_gen_price['model'] == model and image_gen_price['quality'] == quality and image_gen_price['resolution'] == resolution:
            return image_gen_price["price"]
    raise ValueError(f"No image generate price found for {model} {quality} {resolution}")


def calculate_image_gen_cost(model: str, quality: str, resolution: str, n: int) -> float:
    return find_image_gen_prices(model, quality, resolution) * n
