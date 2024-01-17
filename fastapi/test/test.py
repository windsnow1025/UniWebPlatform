import unittest

from app.logic.completion import ChatCompletionFactory
from app.config import init_environment
from app.main import fastapi_response_handler
from app.util.pricing import calculate_cost


class TestCompletion(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        init_environment()

    async def test_completion(self):
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

        factory = ChatCompletionFactory(messages, model, api_type, temperature, stream, fastapi_response_handler)
        completion = factory.create_chat_completion()
        response = completion.process_request()

        prompt_tokens = sum(len(message["content"]) for message in messages)
        completion_tokens = 0

        output = ""
        if stream:
            async for content in response.body_iterator:
                output += content
                completion_tokens += len(content)
        else:
            output = response
            completion_tokens += len(response)

        cost = calculate_cost(api_type, model, prompt_tokens, completion_tokens)

        # Test
        self.assertEqual(output, "This is a test.")
        self.assertAlmostEqual(cost, 0.0015, delta=0.0001)
