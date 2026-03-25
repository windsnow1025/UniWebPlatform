import React from 'react';
import AIStudio from "@/components/ai/AIStudio";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="AI Studio for PolyFlexLLM, a unified web UI for native interactions with various LLM providers (OpenAI, Gemini, Claude, Grok), offering full context control, Markdown + LaTeX rendering, multimodal I/O, file processing, and stream output."
        />
        <title>AI Studio</title>
      </Head>
      <AIStudio/>
    </>
  );
}

export default Index;
