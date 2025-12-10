from typing import List, Dict
from aiohttp import web

from openapi_server.models.auth_token_email_req_dto import AuthTokenEmailReqDto
from openapi_server.models.auth_token_res_dto import AuthTokenResDto
from openapi_server.models.auth_token_username_req_dto import AuthTokenUsernameReqDto
from openapi_server import util


async def auth_controller_create_token_by_email(request: web.Request, body) -> web.Response:
    """auth_controller_create_token_by_email

    

    :param body: 
    :type body: dict | bytes

    """
    body = AuthTokenEmailReqDto.from_dict(body)
    return web.Response(status=200)


async def auth_controller_create_token_by_username(request: web.Request, body) -> web.Response:
    """auth_controller_create_token_by_username

    

    :param body: 
    :type body: dict | bytes

    """
    body = AuthTokenUsernameReqDto.from_dict(body)
    return web.Response(status=200)
