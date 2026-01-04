from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.message_role import MessageRole
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.content import Content


T = TypeVar("T", bound="Message")


@_attrs_define
class Message:
    """
    Attributes:
        role (MessageRole):
        contents (list[Content]):
        id (str | Unset):
        system_prompt_id (float | Unset):
        thought (str | Unset):
        display (str | Unset):
    """

    role: MessageRole
    contents: list[Content]
    id: str | Unset = UNSET
    system_prompt_id: float | Unset = UNSET
    thought: str | Unset = UNSET
    display: str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        role = self.role.value

        contents = []
        for contents_item_data in self.contents:
            contents_item = contents_item_data.to_dict()
            contents.append(contents_item)

        id = self.id

        system_prompt_id = self.system_prompt_id

        thought = self.thought

        display = self.display

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "role": role,
                "contents": contents,
            }
        )
        if id is not UNSET:
            field_dict["id"] = id
        if system_prompt_id is not UNSET:
            field_dict["systemPromptId"] = system_prompt_id
        if thought is not UNSET:
            field_dict["thought"] = thought
        if display is not UNSET:
            field_dict["display"] = display

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.content import Content

        d = dict(src_dict)
        role = MessageRole(d.pop("role"))

        contents = []
        _contents = d.pop("contents")
        for contents_item_data in _contents:
            contents_item = Content.from_dict(contents_item_data)

            contents.append(contents_item)

        id = d.pop("id", UNSET)

        system_prompt_id = d.pop("systemPromptId", UNSET)

        thought = d.pop("thought", UNSET)

        display = d.pop("display", UNSET)

        message = cls(
            role=role,
            contents=contents,
            id=id,
            system_prompt_id=system_prompt_id,
            thought=thought,
            display=display,
        )

        message.additional_properties = d
        return message

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
