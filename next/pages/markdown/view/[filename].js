import React, {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";

import PublicClient from "../../../src/common/public/PublicClient";
import HeaderAppBar from "../../../app/components/common/header/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import {parseMarkdownLaTeX} from "markdown-latex-renderer";

function MarkdownViewer() {
  const {themeType, setThemeType, muiTheme} = useThemeHandler();

  const router = useRouter();
  const {filename} = router.query;
  const markdownRef = useRef(null);
  const publicService = new PublicClient();

  const fetchMarkdown = async () => {
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

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title="Markdown View"/>
        <div className="local-scroll-scrollable m-2">
          <div
            className="markdown-body p-2 min-h-16"
            ref={markdownRef}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MarkdownViewer;
