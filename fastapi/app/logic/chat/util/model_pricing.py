import json

from fastapi import HTTPException


def load_model_prices():
    file_path = 'resources/model_prices.json'
    with open(file_path, 'r') as file:
        return json.load(file)


def find_model_prices(api_type: str, model: str):
    chat_prices = load_model_prices()
    for chat_price in chat_prices:
        if chat_price['api_type'] == api_type and chat_price['model'] == model:
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
