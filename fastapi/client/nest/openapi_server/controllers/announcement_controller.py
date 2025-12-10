from typing import List, Dict
from aiohttp import web

from openapi_server.models.announcement_req_dto import AnnouncementReqDto
from openapi_server.models.announcement_res_dto import AnnouncementResDto
from openapi_server import util


async def announcement_controller_find(request: web.Request, ) -> web.Response:
    """announcement_controller_find

    


    """
    return web.Response(status=200)


async def announcement_controller_update(request: web.Request, body) -> web.Response:
    """announcement_controller_update

    

    :param body: 
    :type body: dict | bytes

    """
    body = AnnouncementReqDto.from_dict(body)
    return web.Response(status=200)
