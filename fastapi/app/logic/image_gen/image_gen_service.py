from sqlalchemy.ext.asyncio import AsyncSession

from app.logic.image_gen import image_gen_client
from app.logic.image_gen.image_gen_parameter import Size, Quality
from app.logic.image_gen.image_gen_pricing import calculate_image_gen_cost
from app.repository import user_repository


async def handle_image_gen_interaction(
        session: AsyncSession,
        username: str,
        prompt: str,
        model: str,
        size: Size,
        quality: Quality,
        n: int,
) -> list[str]:
    cost = calculate_image_gen_cost(model, quality, size, n)
    await user_repository.reduce_credit(username, cost, session)

    return image_gen_client.generate_image(
        prompt=prompt,
        model=model,
        size=size,
        quality=quality,
        n=n,
    )

