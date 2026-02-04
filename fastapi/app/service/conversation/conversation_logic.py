import logging

import httpcore
import httpx
from fastapi import HTTPException

from app.client.nest_js_client.models import ConversationResDto, ConversationReqDto, Message
from app.service.conversation import conversation_client


async def get_conversation(token: str, conversation_id: int) -> ConversationResDto:
    try:
        return await conversation_client.get_conversation(token, conversation_id)
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while fetching conversation: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while fetching conversation: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)


async def update_conversation(
        token: str,
        conversation_id: int,
        etag: str,
        conversation: ConversationReqDto
) -> ConversationResDto:
    try:
        return await conversation_client.update_conversation(
            token, conversation_id, etag, conversation
        )
    except HTTPException as e:
        raise e
    except (httpcore.ConnectError, httpx.ConnectError) as e:
        detail = f"ConnectError while updating conversation: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:
        detail = f"Unknown error while updating conversation: {e}"
        logging.exception(detail)
        raise HTTPException(status_code=500, detail=detail)


async def add_messages_to_conversation(
        token: str,
        conversation_id: int,
        new_messages: list[Message],
) -> ConversationResDto:
    conversation = await get_conversation(token, conversation_id)
    conversation.messages.extend(new_messages)

    updated_conversation_req = ConversationReqDto(
        name=conversation.name,
        messages=conversation.messages,
    )

    return await update_conversation(
        token=token,
        conversation_id=conversation_id,
        etag=str(int(conversation.version)),
        conversation=updated_conversation_req,
    )
