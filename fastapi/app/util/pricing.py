PricingDetails = dict[str, float]

ModelPricing = dict[str, dict[str, PricingDetails]]

model_pricing: ModelPricing = {
    "open_ai": {
        "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
        "gpt-3.5-turbo-0301": {"input": 0.0015, "output": 0.0020},
        "gpt-3.5-turbo-0613": {"input": 0.0015, "output": 0.0020},
        "gpt-3.5-turbo-1106": {"input": 0.0010, "output": 0.0020},
        "gpt-3.5-turbo-0125": {"input": 0.0005, "output": 0.0015},
        "gpt-3.5-turbo-16k": {"input": 0.0030, "output": 0.0040},
        "gpt-3.5-turbo-16k-0613": {"input": 0.0030, "output": 0.0040},
        "gpt-4": {"input": 0.03, "output": 0.06},
        "gpt-4-0314": {"input": 0.03, "output": 0.06},
        "gpt-4-0613": {"input": 0.03, "output": 0.06},
        "gpt-4-32k-0314": {"input": 0.06, "output": 0.12},
        "gpt-4-turbo-preview": {"input": 0.01, "output": 0.03},
        "gpt-4-1106-preview": {"input": 0.01, "output": 0.03},
        "gpt-4-0125-preview": {"input": 0.01, "output": 0.03},
        "gpt-4-vision-preview": {"input": 0.01, "output": 0.03}
    },
    "azure": {
        "gpt-35-turbo": {"input": 0.0015, "output": 0.0020},
        "gpt-35-turbo-16k": {"input": 0.0030, "output": 0.0040},
        "gpt-4": {"input": 0.01, "output": 0.03},
        "gpt-4-32k": {"input": 0.06, "output": 0.12}
    }
}


def calculate_cost(api_type, model, prompt_tokens, completion_tokens):
    pricing_info = model_pricing[api_type][model]

    input_cost = pricing_info["input"] * (prompt_tokens / 1000)
    output_cost = pricing_info["output"] * (completion_tokens / 1000)
    total_cost = input_cost + output_cost

    return total_cost
