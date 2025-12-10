from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.user_privileges_req_dto_roles_item import UserPrivilegesReqDtoRolesItem

T = TypeVar("T", bound="UserPrivilegesReqDto")


@_attrs_define
class UserPrivilegesReqDto:
    """
    Attributes:
        username (str):
        email_verified (bool):
        roles (list[UserPrivilegesReqDtoRolesItem]):
        credit (float):
    """

    username: str
    email_verified: bool
    roles: list[UserPrivilegesReqDtoRolesItem]
    credit: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        username = self.username

        email_verified = self.email_verified

        roles = []
        for roles_item_data in self.roles:
            roles_item = roles_item_data.value
            roles.append(roles_item)

        credit = self.credit

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "username": username,
                "emailVerified": email_verified,
                "roles": roles,
                "credit": credit,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        username = d.pop("username")

        email_verified = d.pop("emailVerified")

        roles = []
        _roles = d.pop("roles")
        for roles_item_data in _roles:
            roles_item = UserPrivilegesReqDtoRolesItem(roles_item_data)

            roles.append(roles_item)

        credit = d.pop("credit")

        user_privileges_req_dto = cls(
            username=username,
            email_verified=email_verified,
            roles=roles,
            credit=credit,
        )

        user_privileges_req_dto.additional_properties = d
        return user_privileges_req_dto

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
