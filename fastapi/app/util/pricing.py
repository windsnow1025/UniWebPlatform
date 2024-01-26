model_pricing_data = [
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo",
        "input": 0.0005,
        "output": 0.0015
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-0301",
        "input": 0.0015,
        "output": 0.0020
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-0613",
        "input": 0.0015,
        "output": 0.0020
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-1106",
        "input": 0.0010,
        "output": 0.0020
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-0125",
        "input": 0.0005,
        "output": 0.0015
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-16k",
        "input": 0.0030,
        "output": 0.0040
    },
    {
        "api_type": "open_ai",
        "model": "gpt-3.5-turbo-16k-0613",
        "input": 0.0030,
        "output": 0.0040
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4",
        "input": 0.03,
        "output": 0.06
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-0314",
        "input": 0.03,
        "output": 0.06
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-0613",
        "input": 0.03,
        "output": 0.06
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-32k-0314",
        "input": 0.06,
        "output": 0.12
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-turbo-preview",
        "input": 0.01,
        "output": 0.03
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-1106-preview",
        "input": 0.01,
        "output": 0.03
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-0125-preview",
        "input": 0.01,
        "output": 0.03
    },
    {
        "api_type": "open_ai",
        "model": "gpt-4-vision-preview",
        "input": 0.01,
        "output": 0.03
    },
    {
        "api_type": "azure",
        "model": "gpt-35-turbo",
        "input": 0.0015,
        "output": 0.0020
    },
    {
        "api_type": "azure",
        "model": "gpt-35-turbo-16k",
        "input": 0.0030,
        "output": 0.0040
    },
    {
        "api_type": "azure",
        "model": "gpt-4",
        "input": 0.01,
        "output": 0.03
    },
    {
        "api_type": "azure",
        "model": "gpt-4-32k",
        "input": 0.06,
        "output": 0.12
    }
]


def find_model_pricing(api_type, model):
    for model_pricing in model_pricing_data:
        if model_pricing['api_type'] == api_type and model_pricing['model'] == model:
            return model_pricing
    return None


def calculate_cost(api_type, model, prompt_tokens, completion_tokens):
    model_pricing = find_model_pricing(api_type, model)

    input_cost = model_pricing["input"] * (prompt_tokens / 1000)
    output_cost = model_pricing["output"] * (completion_tokens / 1000)
    total_cost = input_cost + output_cost

    return total_cost
