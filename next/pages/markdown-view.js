import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import {parseMarkdown} from "../src/util/MarkdownParser";
import {parseLaTeX} from "../src/util/LaTeXParser";
import {ThemeProvider} from "@mui/material/styles";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import PublicService from "../src/service/PublicService";
import {useTheme} from "../app/hooks/useTheme";

function MarkdownViewer() {
  const theme = useTheme();

  const router = useRouter();
  const [markdown, setMarkdown] = useState('');
  const markdownRef = useRef(null);
  const { filename } = router.query;
  const publicService = new PublicService();

  useEffect(() => {

    const fetchMarkdown = async () => {
      const markdown = await publicService.fetchMarkdown(filename);

      setMarkdown(parseMarkdown(markdown));
      parseLaTeX(markdownRef.current);
    };

    if (filename) {
      fetchMarkdown();
      document.title = filename;
    }
  }, [filename]);

  return (
    <ThemeProvider theme={theme}>
      <HeaderAppBar title="Markdown View"/>
      <div className="m-2">
        <div
          className="markdown-body p-2 min-h-16"
          ref={markdownRef}
          dangerouslySetInnerHTML={{__html: parseMarkdown(markdown)}}
        />
      </div>
    </ThemeProvider>
  );
}

export default MarkdownViewer;
