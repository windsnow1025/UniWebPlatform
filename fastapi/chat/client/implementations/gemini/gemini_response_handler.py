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
            if grounding_metadata.grounding_chunks:
                text += "\n\n# Grounding Sources:\n"
                for i, chunk in enumerate(grounding_metadata.grounding_chunks, start=1):
                    if chunk.web:
                        text += f"{i}. [{chunk.web.title}]({chunk.web.uri})\n"
        return text, display

def extract_citations(response: types.GenerateContentResponse) -> list[tuple[str, str]]:
    citations = []
    if grounding_metadata := response.candidates[0].grounding_metadata:
        for grounding_support in grounding_metadata.grounding_supports:
            citation_indices = "".join(f"[{str(index + 1)}]" for index in grounding_support.grounding_chunk_indices)
            citation_text = grounding_support.segment.text
            citations.append((citation_text, citation_indices))
    return citations

def add_citations(text: str, citations: list[tuple[str, str]]) -> str:
    for citation_text, citation_indices in citations:
        index = text.find(citation_text) + len(citation_text)
        text = text[:index] + citation_indices + text[index:]
    return text
