from dataclasses import asdict, is_dataclass


class ChatProcessor:
    def _to_dict(self, data_list):
        return [asdict(item) for item in data_list if is_dataclass(item)]

    def process_request(self):
        raise NotImplementedError
