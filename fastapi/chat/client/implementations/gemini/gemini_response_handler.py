from enum import Enum

from google.genai import types


class PrintingStatus(Enum):
    Start = "start"
    Thought = "thought"
    Response = "response"

class GeminiResponseHandler:
    def __init__(self):
        self.printing_status = PrintingStatus.Start

    def process_gemini_response(self, response: types.GenerateContentResponse):
        output = ""

        for part in response.candidates[0].content.parts:
            if part.thought and self.printing_status == PrintingStatus.Start:
                output += "# Model Thought:\n\n"
                self.printing_status = PrintingStatus.Thought
            elif not part.thought and self.printing_status == PrintingStatus.Thought:
                output += f"\n\n# Model Response:\n\n"
                self.printing_status = PrintingStatus.Response
            output += part.text
        if grounding_metadata := response.candidates[0].grounding_metadata:
            if search_entry_point := grounding_metadata.search_entry_point:
                output += "\n" + search_entry_point.rendered_content
        return output

