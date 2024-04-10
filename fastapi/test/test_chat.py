import unittest

from app.api.chat_router import stream_handler, non_stream_handler
from app.config import init_environment
from app.dao import user_dao
from app.logic.chat.chat_processor_factory import create_chat_processor
from app.util import pricing


class TestChat(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        init_environment()
        self.username = "test"
        self.messages = [
            {
                "role": "user",
                "content": "Say this is a test."
            }
        ]
        self.temperature = 0

    async def test_openai_stream(self):
        model = "gpt-4-turbo"
        api_type = "open_ai"
        stream = True

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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

    async def test_openai_vision_stream(self):
        model = "gpt-4-turbo"
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What's in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                        }
                    },
                ],
            }
        ]
        api_type = "open_ai"
        stream = True

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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

        print("Output: ", output)

    async def test_openai_vision_nonstream(self):
        model = "gpt-4-turbo"
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What's in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                        }
                    },
                ],
            }
        ]
        api_type = "open_ai"
        stream = False

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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

        print("Output: ", output)

    def test_openai_nonstream(self):
        model = "gpt-4-turbo"
        api_type = "open_ai"
        stream = False

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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
        model = "gpt-4"
        api_type = "azure"
        stream = True

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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
        model = "gpt-4"
        api_type = "azure"
        stream = False

        def reduce_credit(prompt_tokens: int, completion_tokens: int) -> float:
            cost = pricing.calculate_cost(
                api_type=api_type,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens
            )
            user_dao.reduce_credit(
                username=self.username,
                cost=cost
            )
            return cost

        processor = create_chat_processor(
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
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
