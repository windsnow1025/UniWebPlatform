chat_prices = [
    {
        "api_type": "open_ai",
        "model": "gpt-4o",
        "input": 5,
        "output": 15
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo",
        "input": 5,
        "output": 15
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-turbo",
        "input": 10,
        "output": 30
    },
    {
        "api_type": "azure",
        "model": "gpt-35-turbo",
        "input": 1.5,
        "output": 2
    },
    {
        "api_type": "azure",
        "model": "gpt-35-turbo-16k",
        "input": 3,
        "output": 4
    },
    {
        "api_type": "azure",
        "model": "gpt-4",
        "input": 10,
        "output": 30
    },
    {
        "api_type": "gemini",
        "model": "gemini-1.5-pro-latest",
        "input": 7,
        "output": 21
    }
]


def find_chat_prices(api_type: str, model: str):
    for chat_price in chat_prices:
        if chat_price['api_type'] == api_type and chat_price['model'] == model:
            return chat_price
    return None


def calculate_chat_cost(api_type: str, model: str, prompt_tokens: int, completion_tokens: int) -> float:
    model_pricing = find_chat_prices(api_type, model)

    input_cost = model_pricing["input"] * (prompt_tokens / 1000000)
    output_cost = model_pricing["output"] * (completion_tokens / 1000000)
    total_cost = input_cost + output_cost

    return total_cost
