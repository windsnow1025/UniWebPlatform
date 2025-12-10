from typing import List, Dict
from aiohttp import web

from openapi_server.models.markdown_req_dto import MarkdownReqDto
from openapi_server.models.markdown_res_dto import MarkdownResDto
from openapi_server import util


async def markdowns_controller_create(request: web.Request, body) -> web.Response:
    """markdowns_controller_create

    

    :param body: 
    :type body: dict | bytes

    """
    body = MarkdownReqDto.from_dict(body)
    return web.Response(status=200)


async def markdowns_controller_delete(request: web.Request, id) -> web.Response:
    """markdowns_controller_delete

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def markdowns_controller_find_all(request: web.Request, ) -> web.Response:
    """markdowns_controller_find_all

    


    """
    return web.Response(status=200)


async def markdowns_controller_find_one(request: web.Request, id) -> web.Response:
    """markdowns_controller_find_one

    

    :param id: 
    :type id: 

    """
    return web.Response(status=200)


async def markdowns_controller_update(request: web.Request, id, if_match, body) -> web.Response:
    """markdowns_controller_update

    

    :param id: 
    :type id: 
    :param if_match: 
    :type if_match: str
    :param body: 
    :type body: dict | bytes

    """
    body = MarkdownReqDto.from_dict(body)
    return web.Response(status=200)
