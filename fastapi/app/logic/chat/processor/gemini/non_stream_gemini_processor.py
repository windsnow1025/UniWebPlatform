import logging
import traceback

from app.logic.chat.processor.gemini.gemini_processor import GeminiProcessor


class NonStreamGeminiProcessor(GeminiProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")

            response = self.model.generate_content(self.messages)

            return self.response_handler(response.text)
        except Exception as e:
            logging.error(f"Exception: {e}")
            traceback.print_exc()
            return str(e)
