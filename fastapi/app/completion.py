import logging
import os

from openai import OpenAI, AzureOpenAI


class ChatCompletionFactory:
    def __init__(
        self,
        messages: list[dict[str, str]],
        model: str,
        api_type: str,
        temperature: float,
        stream: bool,
        response_handler=None
    ):
        self.messages = messages
        self.model = model
        self.api_type = api_type
        self.temperature = temperature
        self.stream = stream
        self.openai = None
        self.response_handler = response_handler

        if api_type == "open_ai":
            self.openai = OpenAI(
                api_key=os.environ["OPENAI_API_KEY"],
            )
        elif api_type == "azure":
            self.openai = AzureOpenAI(
                api_version="2023-07-01-preview",
                azure_endpoint=os.environ["AZURE_API_BASE"],
                api_key=os.environ["AZURE_API_KEY"],
            )

    def create_chat_completion(self) -> 'ChatCompletion':

        if self.stream:
            return StreamChatCompletion(self.model, self.messages, self.temperature, self.api_type, self.openai, self.response_handler)
        else:
            return NonStreamChatCompletion(self.model, self.messages, self.temperature, self.api_type, self.openai)


class ChatCompletion:
    def __init__(
        self,
        model: str,
        messages: list[dict[str, str]],
        temperature: float,
        api_type: str,
        openai,
        response_handler=None
    ):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.api_type = api_type
        self.openai = openai
        self.response_handler = response_handler

    def process_request(self):
        raise NotImplementedError


class NonStreamChatCompletion(ChatCompletion):
    def process_request(self) -> str:
        try:
            logging.info(f"messages: {self.messages}")
            if self.model == "gpt-4-vision-preview":
                completion = self.openai.chat.completions.create(
                    model=self.model,
                    messages=self.messages,
                    temperature=self.temperature,
                    stream=False,
                    max_tokens=4096,
                )
            else:
                completion = self.openai.chat.completions.create(
                    model=self.model,
                    messages=self.messages,
                    temperature=self.temperature,
                    stream=False,
                )

            logging.info(f"Output: {completion.choices[0].message.content}")
            return completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)


class StreamChatCompletion(ChatCompletion):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            if self.model == "gpt-4-vision-preview":
                completion = self.openai.chat.completions.create(
                    model=self.model,
                    messages=self.messages,
                    temperature=self.temperature,
                    stream=True,
                    max_tokens=4096,
                )
            else:
                completion = self.openai.chat.completions.create(
                    model=self.model,
                    messages=self.messages,
                    temperature=self.temperature,
                    stream=True,
                )

            def process_delta(completion_delta) -> str:
                # Necessary for Azure
                if not completion_delta.choices:
                    return ""

                content_delta = completion_delta.choices[0].delta.content
                if not content_delta:
                    content_delta = ""
                logging.debug(f"chunk: {content_delta}")
                return content_delta

            def generate_chunk():
                content = ""
                for completion_delta in completion:
                    content_delta = process_delta(completion_delta)
                    content += content_delta
                    yield content_delta

                logging.info(f"content: {content}")

            return self.response_handler(generate_chunk)

        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)
