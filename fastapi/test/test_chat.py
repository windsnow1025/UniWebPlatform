import unittest

from app.config import init_environment
from app.logic.chat.chat_service import handle_chat_interaction


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

        response = handle_chat_interaction(
            username=self.username,
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
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

        response = handle_chat_interaction(
            username=self.username,
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
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

        response = handle_chat_interaction(
            username=self.username,
            messages=messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
        output = response

        print("Output: ", output)

    def test_openai_nonstream(self):
        model = "gpt-4-turbo"
        api_type = "open_ai"
        stream = False

        response = handle_chat_interaction(
            username=self.username,
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
        output = response

        self.assertEqual(output, "This is a test.")

    async def test_azure_stream(self):
        model = "gpt-4"
        api_type = "azure"
        stream = True

        response = handle_chat_interaction(
            username=self.username,
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
        output = ""
        async for content in response.body_iterator:
            output += content

        self.assertEqual(output, "This is a test.")

    def test_azure_nonstream(self):
        model = "gpt-4"
        api_type = "azure"
        stream = False

        response = handle_chat_interaction(
            username=self.username,
            messages=self.messages,
            model=model,
            api_type=api_type,
            temperature=self.temperature,
            stream=stream,
        )
        output = response

        self.assertEqual(output, "This is a test.")
