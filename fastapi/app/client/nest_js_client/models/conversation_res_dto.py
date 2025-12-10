from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field
from dateutil.parser import isoparse

if TYPE_CHECKING:
    from ..models.message import Message
    from ..models.user_res_dto import UserResDto


T = TypeVar("T", bound="ConversationResDto")


@_attrs_define
class ConversationResDto:
    """
    Attributes:
        id (float):
        name (str):
        messages (list[Message]):
        users (list[UserResDto]):
        updated_at (datetime.datetime):
        is_public (bool):
        color_label (str):
        version (float):
    """

    id: float
    name: str
    messages: list[Message]
    users: list[UserResDto]
    updated_at: datetime.datetime
    is_public: bool
    color_label: str
    version: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        name = self.name

        messages = []
        for messages_item_data in self.messages:
            messages_item = messages_item_data.to_dict()
            messages.append(messages_item)

        users = []
        for users_item_data in self.users:
            users_item = users_item_data.to_dict()
            users.append(users_item)

        updated_at = self.updated_at.isoformat()

        is_public = self.is_public

        color_label = self.color_label

        version = self.version

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "name": name,
                "messages": messages,
                "users": users,
                "updatedAt": updated_at,
                "isPublic": is_public,
                "colorLabel": color_label,
                "version": version,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.message import Message
        from ..models.user_res_dto import UserResDto

        d = dict(src_dict)
        id = d.pop("id")

        name = d.pop("name")

        messages = []
        _messages = d.pop("messages")
        for messages_item_data in _messages:
            messages_item = Message.from_dict(messages_item_data)

            messages.append(messages_item)

        users = []
        _users = d.pop("users")
        for users_item_data in _users:
            users_item = UserResDto.from_dict(users_item_data)

            users.append(users_item)

        updated_at = isoparse(d.pop("updatedAt"))

        is_public = d.pop("isPublic")

        color_label = d.pop("colorLabel")

        version = d.pop("version")

        conversation_res_dto = cls(
            id=id,
            name=name,
            messages=messages,
            users=users,
            updated_at=updated_at,
            is_public=is_public,
            color_label=color_label,
            version=version,
        )

        conversation_res_dto.additional_properties = d
        return conversation_res_dto

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
