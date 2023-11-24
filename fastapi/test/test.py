import asyncio
import json
import os

from fastapi.responses import StreamingResponse

from app.completion import ChatCompletionFactory
from app.pricing import calculate_cost

# Load configuration from config.json
with open("config.json") as config_file:
    config = json.load(config_file)

os.environ["OPENAI_API_KEY"] = config["OPENAI_API_KEY"]
os.environ["AZURE_API_KEY"] = config["AZURE_API_KEY"]
os.environ["AZURE_API_BASE"] = config["AZURE_API_BASE"]


def fastapi_response_handler(generator):
    return StreamingResponse(generator(), media_type='text/plain')


async def openai_test():
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

    if stream:
        async for content in response.body_iterator:
            print(content, end='')
            completion_tokens += len(content)
        print()
    else:
        print(response)
        completion_tokens += len(response)

    cost = calculate_cost(api_type, model, prompt_tokens, completion_tokens)
    print(f"Cost: ${cost:.4f}")


asyncio.run(openai_test())
