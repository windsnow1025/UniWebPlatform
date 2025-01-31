from dataclasses import asdict, is_dataclass
from enum import Enum


class ChatClient:
    def _to_dict(self, data_list):
        def serialize(obj):
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
