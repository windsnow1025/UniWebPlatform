from dataclasses import asdict, is_dataclass


class ChatClient:
    def _to_dict(self, data_list):
        return [asdict(item) for item in data_list if is_dataclass(item)]

    def generate_response(self):
        raise NotImplementedError
