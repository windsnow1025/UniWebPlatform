# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.markdown_req_dto import MarkdownReqDto
from openapi_server.models.markdown_res_dto import MarkdownResDto


pytestmark = pytest.mark.asyncio

async def test_markdowns_controller_create(client):
    """Test case for markdowns_controller_create

    
    """
    body = {"title":"title","content":"content"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/markdowns/markdown',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_markdowns_controller_delete(client):
    """Test case for markdowns_controller_delete

    
    """
    headers = { 
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='DELETE',
        path='/markdowns/markdown/{id}'.format(id=3.4),
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_markdowns_controller_find_all(client):
    """Test case for markdowns_controller_find_all

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/markdowns',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_markdowns_controller_find_one(client):
    """Test case for markdowns_controller_find_one

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/markdowns/markdown/{id}'.format(id=3.4),
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_markdowns_controller_update(client):
    """Test case for markdowns_controller_update

    
    """
    body = {"title":"title","content":"content"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/markdowns/markdown/{id}'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

