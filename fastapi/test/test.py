import unittest

from app.logic.chat.chat_processor import ChatProcessorFactory
from app.config import init_environment
from app.api.completion_router import stream_handler, non_stream_handler, ChatRequest
from app.util.pricing import calculate_cost


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

        factory = ChatProcessorFactory(
            messages=chat_request.messages,
            model=chat_request.model,
            api_type=chat_request.api_type,
            temperature=chat_request.temperature,
            stream=chat_request.stream,
            stream_handler=lambda generator_function: stream_handler(generator_function, username, chat_request),
            non_stream_handler=lambda content: non_stream_handler(content, username, chat_request)
        )
        completion = factory.create_chat_completion()
        response = completion.process_request()

        prompt_tokens = sum(len(message["content"]) for message in chat_request.messages)
        completion_tokens = 0

        output = ""
        if chat_request.stream:
            async for content in response.body_iterator:
                output += content
                completion_tokens += len(content)
        else:
            output = response
            completion_tokens += len(response)

        cost = calculate_cost(chat_request.api_type, chat_request.model, prompt_tokens, completion_tokens)

        # Test
        self.assertEqual(output, "This is a test.")
        self.assertAlmostEqual(cost, 0.0015, delta=0.0001)
