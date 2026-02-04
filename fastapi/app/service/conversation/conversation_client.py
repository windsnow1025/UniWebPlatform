from fastapi import HTTPException

from ...client.nest_js_client.api.conversations.conversations_controller_find_one import asyncio as find_one_async
from ...client.nest_js_client.api.conversations.conversations_controller_update import asyncio as update_async
from ...client.nest_js_client.errors import UnexpectedStatus
from ...client.nest_js_client.models import ConversationResDto, ConversationReqDto
from ...config import get_client


async def get_conversation(token: str, conversation_id: int) -> ConversationResDto:
    client = get_client(token)
    try:
        async with client as client:
            return await find_one_async(id=conversation_id, client=client)
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))


async def update_conversation(
        token: str,
        conversation_id: int,
        etag: str,
        conversation: ConversationReqDto
) -> ConversationResDto:
    client = get_client(token)
    try:
        async with client as client:
            return await update_async(
                id=conversation_id,
                client=client,
                body=conversation,
                if_match=etag,
            )
    except UnexpectedStatus as e:
        raise HTTPException(status_code=e.status_code, detail=e.content.decode(errors='ignore'))
