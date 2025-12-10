from typing import List, Dict
from aiohttp import web

from openapi_server.models.conversation_color_req_dto import ConversationColorReqDto
from openapi_server.models.conversation_name_req_dto import ConversationNameReqDto
from openapi_server.models.conversation_public_req_dto import ConversationPublicReqDto
from openapi_server.models.conversation_req_dto import ConversationReqDto
from openapi_server.models.conversation_res_dto import ConversationResDto
from openapi_server.models.conversation_update_time_res_dto import ConversationUpdateTimeResDto
from openapi_server.models.user_username_req_dto import UserUsernameReqDto
from openapi_server import util


async def conversations_controller_add_user_for_users(request: web.Request, id, if_match, body) -> web.Response:
    """conversations_controller_add_user_for_users

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = UserUsernameReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_clone_for_specific_user(request: web.Request, id, body) -> web.Response:
    """conversations_controller_clone_for_specific_user

    

    :param id: 
    :type id: 
    :param body: 
    :type body: dict | bytes

    """
    body = UserUsernameReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_create(request: web.Request, body) -> web.Response:
    """conversations_controller_create

    

    :param body: 
    :type body: dict | bytes

    """
    body = ConversationReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_delete(request: web.Request, id) -> web.Response:
    """conversations_controller_delete

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def conversations_controller_find(request: web.Request, ) -> web.Response:
    """conversations_controller_find

    


    """
    return web.Response(status=200)


async def conversations_controller_find_one(request: web.Request, id) -> web.Response:
    """conversations_controller_find_one

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def conversations_controller_find_public_one(request: web.Request, id) -> web.Response:
    """conversations_controller_find_public_one

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def conversations_controller_find_update_times(request: web.Request, ) -> web.Response:
    """conversations_controller_find_update_times

    


    """
    return web.Response(status=200)


async def conversations_controller_update(request: web.Request, id, if_match, body) -> web.Response:
    """conversations_controller_update

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = ConversationReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_update_color_label(request: web.Request, id, if_match, body) -> web.Response:
    """conversations_controller_update_color_label

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = ConversationColorReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_update_name(request: web.Request, id, if_match, body) -> web.Response:
    """conversations_controller_update_name

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = ConversationNameReqDto.from_dict(body)
    return web.Response(status=200)


async def conversations_controller_update_public(request: web.Request, id, if_match, body) -> web.Response:
    """conversations_controller_update_public

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = ConversationPublicReqDto.from_dict(body)
    return web.Response(status=200)
