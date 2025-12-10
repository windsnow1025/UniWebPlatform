from enum import Enum


class UserResDtoRolesItem(str, Enum):
    ADMIN = "admin"
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
