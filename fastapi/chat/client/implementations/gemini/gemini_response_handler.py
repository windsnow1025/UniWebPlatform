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

    def add_citations(self, text: str, response: types.GenerateContentResponse) -> str:
        if grounding_metadata := response.candidates[0].grounding_metadata:
            for grounding_support in grounding_metadata.grounding_supports:
                citation = ""
                for grounding_chunk_index in grounding_support.grounding_chunk_indices:
                    citation += f"[{str(grounding_chunk_index + 1)}]"

                citation_text = grounding_support.segment.text
                index = text.find(citation_text) + len(citation_text)
                text = text[:index] + citation + text[index:]

        return text
