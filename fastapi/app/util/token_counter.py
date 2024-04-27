import tiktoken


cost_multiplier = 2


def num_tokens_from_text(text: str) -> int:
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text)) * cost_multiplier
