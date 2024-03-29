import unittest

from app.api.completion_router import stream_handler, non_stream_handler, ChatRequest
from app.config import init_environment
from app.dao import user_dao
from app.logic.chat.chat_processor_factory import create_chat_processor
from app.util import pricing


class TestCompletion(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        init_environment()

    async def test_completion(self):
        username = "test"
        chat_request = ChatRequest(
            messages=[
                {
                    "role": "user",
                    "content": "Say this is a test."
                }
            ],
            model="gpt-4",
            api_type="open_ai",
            temperature=0,
            stream=True
        )

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> None:
            user_dao.reduce_credit(
                username=username,
                cost=pricing.calculate_cost(
                    api_type=chat_request.api_type,
                    model=chat_request.model,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens
                )
            )

        processor = create_chat_processor(
            messages=chat_request.messages,
            model=chat_request.model,
            api_type=chat_request.api_type,
            temperature=chat_request.temperature,
            stream=chat_request.stream,
            non_stream_handler=lambda content: non_stream_handler(
                content,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            ),
            stream_handler=lambda generator_function: stream_handler(
                generator_function,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            )
        )
        response = processor.process_request()

        output = ""
        if chat_request.stream:
            async for content in response.body_iterator:
                output += content
                print(content, end="")
        else:
            output = response
            print(response)

        # Test
        self.assertEqual(output, "This is a test.")
