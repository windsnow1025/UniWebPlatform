import asyncio
import logging

from fastapi.responses import StreamingResponse

from app.completion import ChatCompletionFactory
from app.config import init_environment
from app.util.pricing import calculate_cost

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


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

    output = ""
    if stream:
        async for content in response.body_iterator:
            output += content
            print(content, end='')
            completion_tokens += len(content)
        print()
    else:
        output = response
        print(response)
        completion_tokens += len(response)

    cost = calculate_cost(api_type, model, prompt_tokens, completion_tokens)
    print(f"Cost: ${cost:.4f}")

    # Test
    assert output == "This is a test."
    assert abs(cost - 0.0015) < 0.0001
    print("Test passed.")


def main():
    init_environment()
    asyncio.run(openai_test())


if __name__ == "__main__":
    main()
