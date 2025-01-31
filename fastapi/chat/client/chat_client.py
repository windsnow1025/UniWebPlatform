from dataclasses import asdict, is_dataclass
from enum import Enum
from typing import Any


class ChatClient:
    def _to_dict(self, data_list: list[Any]) -> list[dict]:
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

    def generate_response(self):
        raise NotImplementedError
