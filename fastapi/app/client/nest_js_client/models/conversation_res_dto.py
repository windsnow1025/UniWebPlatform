from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field
from dateutil.parser import isoparse

if TYPE_CHECKING:
    from ..models.label_res_dto import LabelResDto
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
        is_public (bool):
        users (list[UserResDto]):
        label (LabelResDto | None):
        updated_at (datetime.datetime):
        version (float):
    """

    id: float
    name: str
    messages: list[Message]
    is_public: bool
    users: list[UserResDto]
    label: LabelResDto | None
    updated_at: datetime.datetime
    version: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.label_res_dto import LabelResDto

        id = self.id

        name = self.name

        messages = []
        for messages_item_data in self.messages:
            messages_item = messages_item_data.to_dict()
            messages.append(messages_item)

        is_public = self.is_public

        users = []
        for users_item_data in self.users:
            users_item = users_item_data.to_dict()
            users.append(users_item)

        label: dict[str, Any] | None
        if isinstance(self.label, LabelResDto):
            label = self.label.to_dict()
        else:
            label = self.label

        updated_at = self.updated_at.isoformat()

        version = self.version

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "name": name,
                "messages": messages,
                "isPublic": is_public,
                "users": users,
                "label": label,
                "updatedAt": updated_at,
                "version": version,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.label_res_dto import LabelResDto
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

        is_public = d.pop("isPublic")

        users = []
        _users = d.pop("users")
        for users_item_data in _users:
            users_item = UserResDto.from_dict(users_item_data)

            users.append(users_item)

        def _parse_label(data: object) -> LabelResDto | None:
            if data is None:
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                label_type_1 = LabelResDto.from_dict(data)

                return label_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(LabelResDto | None, data)

        label = _parse_label(d.pop("label"))

        updated_at = isoparse(d.pop("updatedAt"))

        version = d.pop("version")

        conversation_res_dto = cls(
            id=id,
            name=name,
            messages=messages,
            is_public=is_public,
            users=users,
            label=label,
            updated_at=updated_at,
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
