import React, {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';

import PublicClient from "../../../src/common/public/PublicClient";
import HeaderAppBar from "../../../app/components/common/header/HeaderAppBar";
import {parseMarkdownLaTeX} from "markdown-latex-renderer";
import {useAppTheme} from "../../../app/contexts/ThemeContext";
import {ThemeType} from "../../../app/utils/Theme";

function MarkdownViewer() {
  const router = useRouter();
  const {filename} = router.query;
  const markdownRef = useRef(null);
  const { rawTheme } = useAppTheme();

  const fetchMarkdown = async () => {
    const publicService = new PublicClient();
    const markdown = await publicService.fetchMarkdown(filename);
    if (markdownRef.current) {
      const darkMode = rawTheme === ThemeType.Dark;
      parseMarkdownLaTeX(markdownRef.current, markdown, darkMode);
    }
  };

  useEffect(() => {
    if (filename) {
      fetchMarkdown();
      document.title = filename;
    }
  }, [filename]);

  return (
    <div className="local-scroll-root">
      <HeaderAppBar title="Markdown View"/>
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
