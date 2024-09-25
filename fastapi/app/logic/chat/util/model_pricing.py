from fastapi import HTTPException

chat_prices = [
    {
        "api_type": "open_ai",
        "model": "gpt-4o",
        "input": 5,
        "output": 15
    },
    {
        "api_type": "open_ai",
        "model": "chatgpt-4o-latest",
        "input": 2.5,
        "output": 10
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4o-mini",
        "input": 0.15,
        "output": 0.6
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-turbo",
        "input": 10,
        "output": 30
    },
    {
        "api_type": "azure",
        "model": "gpt-4o",
        "input": 2.5,
        "output": 10
    },
    {
        "api_type": "github",
        "model": "gpt-4o",
        "input": 2.5,
        "output": 10
    },
    {
        "api_type": "gemini",
        "model": "gemini-1.5-flash-latest",
        "input": 0.15,
        "output": 0.6
    },
    {
        "api_type": "gemini",
        "model": "gemini-1.5-pro-latest",
        "input": 2.5,
        "output": 10
    },
    {
        "api_type": "claude",
        "model": "claude-3-5-sonnet-20240620",
        "input": 3,
        "output": 15
    }
]


def find_chat_prices(api_type: str, model: str):
    for chat_price in chat_prices:
        if chat_price['api_type'] == api_type and chat_price['model'] == model:
            return chat_price
    return None


def calculate_chat_cost(api_type: str, model: str, prompt_tokens: int, completion_tokens: int) -> float:
    model_pricing = find_chat_prices(api_type, model)

    if model_pricing is None:
        raise HTTPException(status_code=400, detail="Invalid Model")

    input_cost = model_pricing["input"] * (prompt_tokens / 1000000)
    output_cost = model_pricing["output"] * (completion_tokens / 1000000)
    total_cost = input_cost + output_cost

    return total_cost
