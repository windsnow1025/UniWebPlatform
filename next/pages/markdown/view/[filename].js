import React, {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';
import PublicClient from "../../../src/common/public/PublicClient";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";
import {useTheme} from "@mui/material";

function MarkdownViewer() {
  const router = useRouter();
  const {filename} = router.query;
  const markdownRef = useRef(null);

  const theme = useTheme();
  const mode = theme.palette.mode;

  const fetchMarkdown = async () => {
    const publicService = new PublicClient();
    const markdown = await publicService.fetchMarkdown(filename);
    if (markdownRef.current) {
      parseMarkdownLaTeX(markdownRef.current, markdown);
    }
  };

  useEffect(() => {
    if (filename) {
      fetchMarkdown();
      document.title = filename;
    }
  }, [filename]);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  return (
    <div className="local-scroll-container">
      
      <div className="local-scroll-scrollable m-2">
        <div
          className="markdown-body p-2 min-h-16"
          ref={markdownRef}
        />
      </div>
    </div>
  );
}

export default MarkdownViewer;
