import React from 'react';
import AIStudio from "@/components/ai/AIStudio";
import {usePageMeta} from "@/components/common/hooks/usePageMeta";

function Index() {
  usePageMeta(
    "AI Studio",
    "AI Studio for PolyFlexLLM, a unified web UI for native interactions with various LLM providers (OpenAI, Gemini, Claude, Grok), offering full context control, Markdown + LaTeX rendering, multimodal I/O, file processing, and stream output."
  );

  return (
    <AIStudio/>
  );
}

export default Index;
