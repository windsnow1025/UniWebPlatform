_aborted_request_ids: set[str] = set()


def set_aborted(request_id: str) -> None:
    _aborted_request_ids.add(request_id)


def is_aborted(request_id: str) -> bool:
    return request_id in _aborted_request_ids


def clear_aborted(request_id: str) -> None:
    _aborted_request_ids.discard(request_id)
