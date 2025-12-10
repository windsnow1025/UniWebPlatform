# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.auth_token_email_req_dto import AuthTokenEmailReqDto
from openapi_server.models.auth_token_res_dto import AuthTokenResDto
from openapi_server.models.auth_token_username_req_dto import AuthTokenUsernameReqDto


pytestmark = pytest.mark.asyncio

async def test_auth_controller_create_token_by_email(client):
    """Test case for auth_controller_create_token_by_email

    
    """
    body = {"password":"password","email":"email"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/auth/token/email',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_auth_controller_create_token_by_username(client):
    """Test case for auth_controller_create_token_by_username

    
    """
    body = {"password":"password","username":"username"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/auth/token/username',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

