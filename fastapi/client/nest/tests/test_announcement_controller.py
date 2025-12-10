# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.announcement_req_dto import AnnouncementReqDto
from openapi_server.models.announcement_res_dto import AnnouncementResDto


pytestmark = pytest.mark.asyncio

async def test_announcement_controller_find(client):
    """Test case for announcement_controller_find

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/announcement',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_announcement_controller_update(client):
    """Test case for announcement_controller_update

    
    """
    body = {"content":"content"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/announcement',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

