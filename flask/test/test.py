from config import *
import os
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["AZURE_API_KEY"] = AZURE_API_KEY
os.environ["AZURE_API_BASE"] = AZURE_API_BASE

from completion import ChatCompletionFactory

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
