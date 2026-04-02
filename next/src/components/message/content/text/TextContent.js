import {useCallback, useEffect, useRef, useState} from "react";
import {applyTheme, desanitizeContent, parseMarkdownLaTeX, sanitizeContent} from "markdown-latex-renderer";
import {ContentEditable, RawEditableState} from "@/lib/common/message/EditableState";
import {useColorScheme} from "@mui/material";

function TextContent({
                       content,
                       setContent,
                       rawEditableState,
                     }) {
  const { mode } = useColorScheme();

  const [contentEditable, setContentEditable] = useState(ContentEditable.PlainTextOnly);
  const contentRef = useRef(null);

  const parse = (content) => {
    contentRef.current.innerHTML = parseMarkdownLaTeX(content);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = sanitizeContent(content);
  }

  const updateDisplay = useCallback(async (content, editableState) => {
    function getResolvedMode(mode) {
      if (mode === "system") {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
      }
      return mode;
    }

    const resolvedMode = getResolvedMode(mode);
    applyTheme(resolvedMode);

    if (!contentRef.current) {
      return;
    }

    // Always False -> Parse and not allow edit
    if (editableState === RawEditableState.AlwaysFalse) {
      parse(content);
      setContentEditable(ContentEditable.False);
      return;
    }

    // Always True -> Unparse and allow edit
    if (editableState === RawEditableState.AlwaysTrue) {
      unparse(content);
      setContentEditable(ContentEditable.PlainTextOnly);
      return;
    }
  }, [mode]);

  useEffect(() => {
    updateDisplay(content, rawEditableState);
  }, [content, rawEditableState, mode, updateDisplay]);

  const handleBlur = () => {
    // Prevent content update on blur caused by clicking links
    if (rawEditableState !== RawEditableState.AlwaysTrue) {
      return;
    }

    // Like textContent, but also converts <br> and <div> boundaries to \n
    const getTextWithLineBreaks = (element) => {
      let text = '';
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        } else if (node.nodeName === 'BR') {
          text += '\n';
        } else if (node.nodeName === 'DIV') {
          if (text.length > 0 && !text.endsWith('\n')) {
            text += '\n';
          }
          text += getTextWithLineBreaks(node);
        }
      }
      return text;
    };

    const newContent = desanitizeContent(getTextWithLineBreaks(contentRef.current));
    setContent(newContent);
  };

  return (
    <div
      className="local-scroll-scrollable markdown-body p-4 h-full rounded min-h-16"
      contentEditable={contentEditable}
      ref={contentRef}
      onBlur={handleBlur}
    />
  );
}

export default TextContent;
