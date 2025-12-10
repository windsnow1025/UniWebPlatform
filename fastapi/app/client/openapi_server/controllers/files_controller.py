from typing import List, Dict
from aiohttp import web

from openapi_server.models.files_req_dto import FilesReqDto
from openapi_server.models.files_res_dto import FilesResDto
from openapi_server.models.web_url_res_dto import WebUrlResDto
from openapi_server import util


async def files_controller_clone_files(request: web.Request, body) -> web.Response:
    """files_controller_clone_files

    

    :param body: 
    :type body: dict | bytes

    """
    body = FilesReqDto.from_dict(body)
    return web.Response(status=200)


async def files_controller_delete_files(request: web.Request, body) -> web.Response:
    """files_controller_delete_files

    

    :param body: 
    :type body: dict | bytes

    """
    body = FilesReqDto.from_dict(body)
    return web.Response(status=200)


async def files_controller_get_files(request: web.Request, ) -> web.Response:
    """files_controller_get_files

    


    """
    return web.Response(status=200)


async def files_controller_get_minio_web_url(request: web.Request, ) -> web.Response:
    """files_controller_get_minio_web_url

    


    """
    return web.Response(status=200)


async def files_controller_upload_files(request: web.Request, ) -> web.Response:
    """files_controller_upload_files

    


    """
    return web.Response(status=200)
