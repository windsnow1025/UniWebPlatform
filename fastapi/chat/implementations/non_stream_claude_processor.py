import logging
import re

import httpx
from fastapi import HTTPException

from chat.interfaces.claude_processor import ClaudeProcessor


class NonStreamClaudeProcessor(ClaudeProcessor):
    def process_request(self):
        try:
            logging.info(f"messages: {self.messages}")
            message = self.anthropic.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=self.temperature,
                system=self.system,
                messages=self._to_dict(self.messages)
            )

            content = message.content[0].text
            return self.response_handler(content)
        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            text = e.response.text
            raise HTTPException(status_code=status_code, detail=text)
        except Exception as e:
            match = re.search(r'\d{3}', str(e))
            if match:
                error_code = int(match.group(0))
            else:
                error_code = 500

            logging.exception(e)
            raise HTTPException(status_code=error_code, detail=str(e))
