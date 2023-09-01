from flask import Response
import logging
import os
import openai


class ChatCompletionFactory:
    def __init__(self, model, messages, temperature, stream):
        self.model = model
        self.messages = messages
        self.temperature = temperature
        self.stream = stream

        # Should be deleted after the main API_KEY has access to the gpt-4-32k model
        if "gpt-4-32k" in model:
            self.api_key = os.environ["OPENAI_API_KEY_32K"]
            openai.api_base = os.environ["OPENAI_API_BASE_32K"]
        else:
            self.api_key = os.environ["OPENAI_API_KEY"]

        openai.api_key = self.api_key

    def create_chat_completion(self):
        if self.stream:
            return StreamChatCompletion(self.model, self.messages, self.temperature)
        else:
            return NonStreamChatCompletion(self.model, self.messages, self.temperature)


class ChatCompletion:
    def __init__(self, model, messages, temperature):
        self.model = model
        self.messages = messages
        self.temperature = temperature

    def process_request(self):
        raise NotImplementedError


class NonStreamChatCompletion(ChatCompletion):
    def process_request(self):
        try:
            logging.info("Before calling openai.ChatCompletion.create")
            completion = openai.ChatCompletion.create(
                model=self.model,
                messages=self.messages,
                temperature=self.temperature,
                stream=False,
            )
            logging.info("After calling openai.ChatCompletion.create")
            logging.info("content: " + completion.choices[0]["message"]["content"])
            return completion.choices[0]["message"]["content"]
        except Exception as e:
            logging.error(f"openai.ChatCompletion.create error: {e}")
            return str(e)


class StreamChatCompletion(ChatCompletion):
    def process_request(self):
        try:
            logging.info("Before calling openai.ChatCompletion.create")
            completion = openai.ChatCompletion.create(
                model=self.model,
                messages=self.messages,
                temperature=self.temperature,
                stream=True,
            )
            logging.info("After calling openai.ChatCompletion.create")

            def process_delta(completion_delta):
                delta = completion_delta['choices'][0]['delta']
                content_delta = delta.get('content', '')
                logging.debug(f"chunk: {content_delta}")
                return content_delta

            def generate_chunk():
                content = ""
                for completion_delta in completion:
                    content_delta = process_delta(completion_delta)
                    content += content_delta
                    yield content_delta

                logging.info(f"content: {content}")

            return Response(generate_chunk(), mimetype='text/plain')

        except Exception as e:
            logging.error(f"openai.ChatCompletion.create error: {e}")
            return str(e)
