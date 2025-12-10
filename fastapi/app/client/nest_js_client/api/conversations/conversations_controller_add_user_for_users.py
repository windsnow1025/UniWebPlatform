from http import HTTPStatus
from typing import Any
from urllib.parse import quote

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.conversation_res_dto import ConversationResDto
from ...models.user_username_req_dto import UserUsernameReqDto
from ...types import Response


def _get_kwargs(
    id: float,
    *,
    body: UserUsernameReqDto,
    if_match: str,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}
    headers["if-match"] = if_match

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/conversations/conversation/{id}/users".format(
            id=quote(str(id), safe=""),
        ),
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(*, client: AuthenticatedClient | Client, response: httpx.Response) -> ConversationResDto | None:
    if response.status_code == 201:
        response_201 = ConversationResDto.from_dict(response.json())

        return response_201

    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(*, client: AuthenticatedClient | Client, response: httpx.Response) -> Response[ConversationResDto]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    id: float,
    *,
    client: AuthenticatedClient | Client,
    body: UserUsernameReqDto,
    if_match: str,
) -> Response[ConversationResDto]:
    """
    Args:
        id (float):
        if_match (str):
        body (UserUsernameReqDto):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConversationResDto]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
        if_match=if_match,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    id: float,
    *,
    client: AuthenticatedClient | Client,
    body: UserUsernameReqDto,
    if_match: str,
) -> ConversationResDto | None:
    """
    Args:
        id (float):
        if_match (str):
        body (UserUsernameReqDto):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConversationResDto
    """

    return sync_detailed(
        id=id,
        client=client,
        body=body,
        if_match=if_match,
    ).parsed


async def asyncio_detailed(
    id: float,
    *,
    client: AuthenticatedClient | Client,
    body: UserUsernameReqDto,
    if_match: str,
) -> Response[ConversationResDto]:
    """
    Args:
        id (float):
        if_match (str):
        body (UserUsernameReqDto):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ConversationResDto]
    """

    kwargs = _get_kwargs(
        id=id,
        body=body,
        if_match=if_match,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    id: float,
    *,
    client: AuthenticatedClient | Client,
    body: UserUsernameReqDto,
    if_match: str,
) -> ConversationResDto | None:
    """
    Args:
        id (float):
        if_match (str):
        body (UserUsernameReqDto):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ConversationResDto
    """

    return (
        await asyncio_detailed(
            id=id,
            client=client,
            body=body,
            if_match=if_match,
        )
    ).parsed
