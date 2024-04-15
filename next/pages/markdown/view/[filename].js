import '../../../src/asset/css/index.css';
import '../../../src/asset/css/markdown.css';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import PublicService from "../../../src/service/PublicService";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function MarkdownViewer() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const router = useRouter();
  const { filename } = router.query;
  const markdownRef = useRef(null);
  const publicService = new PublicService();

  const fetchMarkdown = async () => {
    const markdown = await publicService.fetchMarkdown(filename);
    markdownRef.current.innerHTML = await parseMarkdown(markdown);
  };

  useEffect(() => {
    if (filename) {
      fetchMarkdown();
      document.title = filename;
    }
  }, [filename]);

  useEffect(() => {
    if (markdownRef.current) {
      parseLaTeX(markdownRef.current);
    }
  }, [markdownRef]);

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          <HeaderAppBar
            title="Markdown View"
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="m-2">
            <div
              className="markdown-body p-2 min-h-16"
              ref={markdownRef}
            />
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default MarkdownViewer;
