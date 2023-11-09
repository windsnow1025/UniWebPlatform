import json
import os
from completion import ChatCompletionFactory

# Load configuration from config.json
with open("test/config.json") as config_file:
    config = json.load(config_file)

os.environ["OPENAI_API_KEY"] = config["OPENAI_API_KEY"]
os.environ["AZURE_API_KEY"] = config["AZURE_API_KEY"]
os.environ["AZURE_API_BASE"] = config["AZURE_API_BASE"]

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