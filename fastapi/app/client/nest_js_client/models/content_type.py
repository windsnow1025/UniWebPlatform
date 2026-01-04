from enum import Enum


class ContentType(str, Enum):
    CODE = "code"
    CODE_OUTPUT = "code_output"
    FILE = "file"
    TEXT = "text"

    def __str__(self) -> str:
        return str(self.value)
