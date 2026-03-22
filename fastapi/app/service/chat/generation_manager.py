class GenerationManager:
    def __init__(self):
        self._active: dict[int, str] = {}  # conversation_id → request_id
        self._request_to_conversation: dict[str, int] = {}  # request_id → conversation_id
        self._aborted: set[str] = set()

    def start(self, conversation_id: int | None, request_id: str) -> None:
        if conversation_id is not None:
            self._active[conversation_id] = request_id
            self._request_to_conversation[request_id] = conversation_id

    def finish(self, conversation_id: int | None, request_id: str) -> None:
        if conversation_id is not None and self._active.get(conversation_id) == request_id:
            del self._active[conversation_id]
        self._request_to_conversation.pop(request_id, None)
        self._aborted.discard(request_id)

    def set_aborted(self, request_id: str) -> None:
        self._aborted.add(request_id)
        conversation_id = self._request_to_conversation.pop(request_id, None)
        if conversation_id is not None and self._active.get(conversation_id) == request_id:
            del self._active[conversation_id]

    def is_aborted(self, request_id: str) -> bool:
        return request_id in self._aborted

    def is_generating(self, conversation_id: int) -> bool:
        return conversation_id in self._active


generation_manager = GenerationManager()
