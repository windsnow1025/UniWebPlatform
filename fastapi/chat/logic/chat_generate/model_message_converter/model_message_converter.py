from chat.logic.chat_generate.model_message_converter.claude_message_converter import convert_message_to_claude
from chat.logic.chat_generate.model_message_converter.gpt_message_converter import convert_message_to_gpt
from chat.logic.chat_generate.model_message_converter.gemini_message_converter import convert_message_to_gemini
from chat.type.model_message.claude_message import ClaudeMessage
from chat.type.model_message.gemini_message import GeminiMessage
from chat.type.model_message.gpt_message import GptMessage
from chat.type.message import Message


async def convert_messages_to_gemini(messages: list[Message]) -> list[GeminiMessage]:
    return [await convert_message_to_gemini(message) for message in messages]


async def convert_messages_to_gpt(messages: list[Message]) -> list[GptMessage]:
    return [await convert_message_to_gpt(message) for message in messages]


async def convert_messages_to_claude(messages: list[Message]) -> list[ClaudeMessage]:
    return [await convert_message_to_claude(message) for message in messages]
