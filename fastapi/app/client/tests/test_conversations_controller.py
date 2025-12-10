# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.conversation_color_req_dto import ConversationColorReqDto
from openapi_server.models.conversation_name_req_dto import ConversationNameReqDto
from openapi_server.models.conversation_public_req_dto import ConversationPublicReqDto
from openapi_server.models.conversation_req_dto import ConversationReqDto
from openapi_server.models.conversation_res_dto import ConversationResDto
from openapi_server.models.conversation_update_time_res_dto import ConversationUpdateTimeResDto
from openapi_server.models.user_username_req_dto import UserUsernameReqDto


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_add_user_for_users(client):
    """Test case for conversations_controller_add_user_for_users

    
    """
    body = {"username":"username"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/conversations/conversation/{id}/users'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_clone_for_specific_user(client):
    """Test case for conversations_controller_clone_for_specific_user

    
    """
    body = {"username":"username"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/conversations/conversation/{id}/clone'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_create(client):
    """Test case for conversations_controller_create

    
    """
    body = {"name":"name","messages":[{"role":"user","thought":"thought","contents":[{"data":"data","type":"text"},{"data":"data","type":"text"}],"display":"display","id":"id"},{"role":"user","thought":"thought","contents":[{"data":"data","type":"text"},{"data":"data","type":"text"}],"display":"display","id":"id"}]}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='POST',
        path='/conversations/conversation',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_delete(client):
    """Test case for conversations_controller_delete

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='DELETE',
        path='/conversations/conversation/{id}'.format(id=3.4),
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_find(client):
    """Test case for conversations_controller_find

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/conversations',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_find_one(client):
    """Test case for conversations_controller_find_one

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/conversations/conversation/{id}'.format(id=3.4),
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_find_public_one(client):
    """Test case for conversations_controller_find_public_one

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/conversations/public/conversation/{id}'.format(id=3.4),
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_find_update_times(client):
    """Test case for conversations_controller_find_update_times

    
    """
    headers = { 
        'Accept': 'application/json',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='GET',
        path='/conversations/update-times',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_update(client):
    """Test case for conversations_controller_update

    
    """
    body = {"name":"name","messages":[{"role":"user","thought":"thought","contents":[{"data":"data","type":"text"},{"data":"data","type":"text"}],"display":"display","id":"id"},{"role":"user","thought":"thought","contents":[{"data":"data","type":"text"},{"data":"data","type":"text"}],"display":"display","id":"id"}]}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/conversations/conversation/{id}'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_update_color_label(client):
    """Test case for conversations_controller_update_color_label

    
    """
    body = {"colorLabel":"colorLabel"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/conversations/conversation/{id}/color-label'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_update_name(client):
    """Test case for conversations_controller_update_name

    
    """
    body = {"name":"name"}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/conversations/conversation/{id}/name'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_conversations_controller_update_public(client):
    """Test case for conversations_controller_update_public

    
    """
    body = {"isPublic":True}
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'if_match': 'if_match_example',
        'Authorization': 'Bearer special-key',
    }
    response = await client.request(
        method='PUT',
        path='/conversations/conversation/{id}/public'.format(id=3.4),
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

