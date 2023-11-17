import json
import os
from completion import ChatCompletionFactory

# Load configuration from config.json
with open("test/config.json") as config_file:
    config = json.load(config_file)

os.environ["OPENAI_API_KEY"] = config["OPENAI_API_KEY"]
os.environ["AZURE_API_KEY"] = config["AZURE_API_KEY"]
os.environ["AZURE_API_BASE"] = config["AZURE_API_BASE"]


def openai_test():
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

    factory = ChatCompletionFactory(messages, model, api_type, temperature, stream)
    completion = factory.create_chat_completion()
    response = completion.process_request()

    if stream:
        for content in response.response:
            print(content, end='')
    else:
        print(response)


def openai_vision_test():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What’s in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                },
            ],
        }
    ]
    model = "gpt-4-vision-preview"
    api_type = "open_ai"
    temperature = 0
    stream = False

    factory = ChatCompletionFactory(messages, model, api_type, temperature, stream)
    completion = factory.create_chat_completion()
    response = completion.process_request()

    if stream:
        for content in response.response:
            print(content, end='')
    else:
        print(response)


openai_test()
