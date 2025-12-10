from typing import List, Dict
from aiohttp import web

from openapi_server.models.reduce_credit_req_dto import ReduceCreditReqDto
from openapi_server.models.user_avatar_req_dto import UserAvatarReqDto
from openapi_server.models.user_email_password_req_dto import UserEmailPasswordReqDto
from openapi_server.models.user_email_req_dto import UserEmailReqDto
from openapi_server.models.user_password_req_dto import UserPasswordReqDto
from openapi_server.models.user_privileges_req_dto import UserPrivilegesReqDto
from openapi_server.models.user_req_dto import UserReqDto
from openapi_server.models.user_res_dto import UserResDto
from openapi_server.models.user_username_req_dto import UserUsernameReqDto
from openapi_server import util


async def users_controller_create(request: web.Request, body) -> web.Response:
    """users_controller_create

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_delete(request: web.Request, ) -> web.Response:
    """users_controller_delete

    


    """
    return web.Response(status=200)


async def users_controller_delete_all_firebase_users(request: web.Request, ) -> web.Response:
    """users_controller_delete_all_firebase_users

    


    """
    return web.Response(status=200)


async def users_controller_delete_by_id(request: web.Request, id) -> web.Response:
    """users_controller_delete_by_id

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def users_controller_find(request: web.Request, ) -> web.Response:
    """users_controller_find

    


    """
    return web.Response(status=200)


async def users_controller_find_one(request: web.Request, ) -> web.Response:
    """users_controller_find_one

    


    """
    return web.Response(status=200)


async def users_controller_reduce_credit(request: web.Request, body) -> web.Response:
    """users_controller_reduce_credit

    

    :param body: 
    :type body: dict | bytes

    """
    body = ReduceCreditReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_send_email_verification(request: web.Request, body) -> web.Response:
    """users_controller_send_email_verification

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserEmailReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_send_password_reset_email(request: web.Request, body) -> web.Response:
    """users_controller_send_password_reset_email

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserEmailReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_avatar(request: web.Request, body) -> web.Response:
    """users_controller_update_avatar

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserAvatarReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_email(request: web.Request, body) -> web.Response:
    """users_controller_update_email

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserEmailReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_email_verified(request: web.Request, ) -> web.Response:
    """users_controller_update_email_verified

    


    """
    return web.Response(status=200)


async def users_controller_update_password(request: web.Request, body) -> web.Response:
    """users_controller_update_password

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserPasswordReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_privileges(request: web.Request, body) -> web.Response:
    """users_controller_update_privileges

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserPrivilegesReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_reset_password(request: web.Request, body) -> web.Response:
    """users_controller_update_reset_password

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserEmailPasswordReqDto.from_dict(body)
    return web.Response(status=200)


async def users_controller_update_username(request: web.Request, body) -> web.Response:
    """users_controller_update_username

    

    :param body: 
    :type body: dict | bytes

    """
    body = UserUsernameReqDto.from_dict(body)
    return web.Response(status=200)
