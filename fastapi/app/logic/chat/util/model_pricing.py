from fastapi import HTTPException
from llm_bridge import get_model_prices, ModelPrice


def find_model_prices(api_type: str, model: str) -> ModelPrice | None:
    chat_prices = get_model_prices()
    for chat_price in chat_prices:
        if chat_price['apiType'] == api_type and chat_price['model'] == model:
            return chat_price
    return None


def calculate_chat_cost(api_type: str, model: str, prompt_tokens: int, completion_tokens: int) -> float:
    model_pricing = find_model_prices(api_type, model)

    if model_pricing is None:
        raise HTTPException(status_code=400, detail="Invalid Model")

    input_cost = model_pricing["input"] * (prompt_tokens / 1_000_000)
    output_cost = model_pricing["output"] * (completion_tokens / 1_000_000)
    total_cost = input_cost + output_cost

    return total_cost
