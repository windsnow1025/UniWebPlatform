from typing import List, Dict
from aiohttp import web

from openapi_server import util


async def app_controller_get_root(request: web.Request, ) -> web.Response:
    """app_controller_get_root

    


    """
    return web.Response(status=200)
