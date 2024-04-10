import logging

from app.logic.chat.processor.gpt.gpt_processor import GPTProcessor


class NonStreamGPTProcessor(GPTProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            completion = self.openai.chat.completions.create(
                messages=self.messages,
                model=self.model,
                temperature=self.temperature,
                stream=False
            )

            content = completion.choices[0].message.content
            return self.response_handler(content)
        except Exception as e:
            logging.error(f"Exception: {e}")
            return str(e)
