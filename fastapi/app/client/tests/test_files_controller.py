# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.files_req_dto import FilesReqDto
from openapi_server.models.files_res_dto import FilesResDto
from openapi_server.models.web_url_res_dto import WebUrlResDto


pytestmark = pytest.mark.asyncio

async def test_files_controller_clone_files(client):
    """Test case for files_controller_clone_files

    
    """
    body = {"filenames":["filenames","filenames"]}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/files/clone',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_files_controller_delete_files(client):
    """Test case for files_controller_delete_files

    
    """
    body = {"filenames":["filenames","filenames"]}
    headers = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='DELETE',
        path='/files',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_files_controller_get_files(client):
    """Test case for files_controller_get_files

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/files',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_files_controller_get_minio_web_url(client):
    """Test case for files_controller_get_minio_web_url

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/files/web-url',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_files_controller_upload_files(client):
    """Test case for files_controller_upload_files

    
    """
    headers = { 
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/files',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

