model_pricing_data = [
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
        "model": "gemini-1.0-pro-latest",
        "input": 0.5,
        "output": 1.5
    },
    {
        "api_type": "gemini",
        "model": "gemini-1.5-pro-latest",
        "input": 7,
        "output": 21
    }
]


def find_model_pricing(api_type, model):
    for model_pricing in model_pricing_data:
        if model_pricing['api_type'] == api_type and model_pricing['model'] == model:
            return model_pricing
    return None


def calculate_cost(api_type, model, prompt_tokens, completion_tokens):
    model_pricing = find_model_pricing(api_type, model)

    input_cost = model_pricing["input"] * (prompt_tokens / 1000000)
    output_cost = model_pricing["output"] * (completion_tokens / 1000000)
    total_cost = input_cost + output_cost

    return total_cost
