from enum import Enum

from google.genai import types


class PrintingStatus(Enum):
    Start = "start"
    Thought = "thought"
    Response = "response"

class GeminiResponseHandler:
    def __init__(self):
        self.printing_status = PrintingStatus.Start

    def process_gemini_response(
            self, response: types.GenerateContentResponse
    ) -> tuple[str, str]:
        text = ""
        display = None

        for part in response.candidates[0].content.parts:
            if part.thought and self.printing_status == PrintingStatus.Start:
                text += "# Model Thought:\n\n"
                self.printing_status = PrintingStatus.Thought
            elif not part.thought and self.printing_status == PrintingStatus.Thought:
                text += f"\n\n# Model Response:\n\n"
                self.printing_status = PrintingStatus.Response
            text += part.text
        if grounding_metadata := response.candidates[0].grounding_metadata:
            if search_entry_point := grounding_metadata.search_entry_point:
                display = search_entry_point.rendered_content
        return text, display

