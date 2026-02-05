from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field
from dateutil.parser import isoparse

if TYPE_CHECKING:
    from ..models.content import Content
    from ..models.user_res_dto import UserResDto


T = TypeVar("T", bound="PromptResDto")


@_attrs_define
class PromptResDto:
    """
    Attributes:
        id (float):
        name (str):
        contents (list[Content]):
        user (UserResDto):
        updated_at (datetime.datetime):
        version (float):
    """

    id: float
    name: str
    contents: list[Content]
    user: UserResDto
    updated_at: datetime.datetime
    version: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        name = self.name

        contents = []
        for contents_item_data in self.contents:
            contents_item = contents_item_data.to_dict()
            contents.append(contents_item)

        user = self.user.to_dict()

        updated_at = self.updated_at.isoformat()

        version = self.version

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "name": name,
                "contents": contents,
                "user": user,
                "updatedAt": updated_at,
                "version": version,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.content import Content
        from ..models.user_res_dto import UserResDto

        d = dict(src_dict)
        id = d.pop("id")

        name = d.pop("name")

        contents = []
        _contents = d.pop("contents")
        for contents_item_data in _contents:
            contents_item = Content.from_dict(contents_item_data)

            contents.append(contents_item)

        user = UserResDto.from_dict(d.pop("user"))

        updated_at = isoparse(d.pop("updatedAt"))

        version = d.pop("version")

        prompt_res_dto = cls(
            id=id,
            name=name,
            contents=contents,
            user=user,
            updated_at=updated_at,
            version=version,
        )

        prompt_res_dto.additional_properties = d
        return prompt_res_dto

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
