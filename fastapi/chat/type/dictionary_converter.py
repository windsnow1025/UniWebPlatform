from dataclasses import is_dataclass, asdict
from enum import Enum
from typing import Any


def to_dict(data_list: list[Any]) -> list[dict]:
    def serialize(obj: Any) -> str | dict | list | Any:
        if isinstance(obj, Enum):
            return obj.value
        elif is_dataclass(obj):
            return {key: serialize(value) for key, value in asdict(obj).items()}
        elif isinstance(obj, list):
            return [serialize(item) for item in obj]
        elif isinstance(obj, dict):
            return {key: serialize(value) for key, value in obj.items()}
        else:
            return obj

    return [serialize(item) for item in data_list]
