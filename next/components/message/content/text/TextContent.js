import {useEffect, useRef, useState} from "react";
import {applyTheme, desanitizeContent, parseMarkdownLaTeX, sanitizeContent} from "markdown-latex-renderer";
import {ContentEditable, RawEditableState} from "@/lib/common/message/EditableState";
import {useTheme} from "@mui/material";

function TextContent({
                       content,
                       setContent,
                       rawEditableState,
                       setConversationUpdateKey,
                     }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [contentEditable, setContentEditable] = useState(ContentEditable.PlainTextOnly);
  const contentRef = useRef(null);

  const parse = (content) => {
    contentRef.current.innerHTML = parseMarkdownLaTeX(content);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = sanitizeContent(content);
  }

  const updateDisplay = async (content, editableState) => {
    applyTheme(mode);

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
  }

  useEffect(() => {
    updateDisplay(content, rawEditableState);
  }, [content, rawEditableState, mode]);

  const handleBlur = () => {
    const newContent = desanitizeContent(contentRef.current.textContent);
    setContent(newContent);

    if (setConversationUpdateKey) {
      setConversationUpdateKey(prev => prev + 1);
    }
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
