from dataclasses import asdict, is_dataclass


class ChatProcessor:
    def _to_dict(self, data_list):
        """
        Converts a list of dataclass instances into a list of dictionaries.

        Args:
          data_list: A list containing dataclass instances.

        Returns:
          A list of dictionaries, where each dictionary represents a dataclass instance.
        """
        return [asdict(item) for item in data_list if is_dataclass(item)]

    def process_request(self):
        raise NotImplementedError
