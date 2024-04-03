import unittest

from app.api.chat_router import stream_handler, non_stream_handler
from app.config import init_environment
from app.dao import user_dao
from app.logic.chat.chat_processor_factory import create_chat_processor
from app.util import pricing


class TestChat(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        init_environment()

    async def test_openai_stream(self):
        username = "test"
        messages = [
            {
                "role": "user",
                "content": "Say this is a test."
            }
        ]
        model = "gpt-4"
        api_type = "open_ai"
        temperature = 0
        stream = True

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            non_stream_response_handler=lambda content: non_stream_handler(
                content,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            ),
            stream_response_handler=lambda generator_function: stream_handler(
                generator_function,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            )
        )
        response = processor.process_request()

        output = ""
        async for content in response.body_iterator:
            output += content

        self.assertEqual(output, "This is a test.")

    def test_openai_nonstream(self):
        username = "test"
        messages = [
            {
                "role": "user",
                "content": "Say this is a test."
            }
        ]
        model = "gpt-4"
        api_type = "open_ai"
        temperature = 0
        stream = False

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            non_stream_response_handler=lambda content: non_stream_handler(
                content,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            ),
            stream_response_handler=lambda generator_function: stream_handler(
                generator_function,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            )
        )
        response = processor.process_request()

        output = response

        self.assertEqual(output, "This is a test.")

    async def test_azure_stream(self):
        username = "test"
        messages = [
            {
                "role": "user",
                "content": "Say this is a test."
            }
        ]
        model = "gpt-4"
        api_type = "azure"
        temperature = 0
        stream = True

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            non_stream_response_handler=lambda content: non_stream_handler(
                content,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            ),
            stream_response_handler=lambda generator_function: stream_handler(
                generator_function,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            )
        )
        response = processor.process_request()

        output = ""
        async for content in response.body_iterator:
            output += content

        self.assertEqual(output, "This is a test.")

    def test_azure_nonstream(self):
        username = "test"
        messages = [
            {
                "role": "user",
                "content": "Say this is a test."
            }
        ]
        model = "gpt-4"
        api_type = "azure"
        temperature = 0
        stream = False

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=temperature,
            stream=stream,
            non_stream_response_handler=lambda content: non_stream_handler(
                content,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            ),
            stream_response_handler=lambda generator_function: stream_handler(
                generator_function,
                lambda completion_tokens: reduce_credit(prompt_tokens=0, completion_tokens=completion_tokens)
            )
        )
        response = processor.process_request()

        output = response

        self.assertEqual(output, "This is a test.")
