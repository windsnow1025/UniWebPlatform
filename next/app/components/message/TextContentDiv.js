import {useEffect, useRef, useState} from "react";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";
import {ContentEditable, RawEditableState} from "../../../src/conversation/chat/Message";
import {useTheme} from "@mui/material";

function TextContentDiv({
                      content,
                      setContent,
                      shouldSanitize = true,
                      rawEditableState = RawEditableState.InteractionBased,
                    }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [contentEditable, setContentEditable] = useState("plaintext-only");
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  const parse = (content, shouldSanitize) => {
    parseMarkdownLaTeX(contentRef.current, content, shouldSanitize);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = content;
  }

  const processMarkdown = async (content, editing, shouldSanitize, editableState) => {
    applyTheme(mode);

    if (!contentRef.current) {
      return;
    }

    // Always False -> Parse and not allow edit
    if (editableState === RawEditableState.AlwaysFalse) {
      await parse(content, shouldSanitize);
      setContentEditable(ContentEditable.False);
      return;
    }

    // Focus or Always True -> Unparse and allow edit
    if (editing || editableState === RawEditableState.AlwaysTrue) {
      unparse(content);
      setContentEditable(ContentEditable.PlainTextOnly);
      return;
    }

    // Blur -> Parse and allow edit
    if (!editing) {
      await parse(content, shouldSanitize);
      setContentEditable(ContentEditable.True); // "plaintext-only" will lead to inconsistent display behavior with "false"
      return;
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, shouldSanitize, rawEditableState);
  }, [content, editing, shouldSanitize, rawEditableState, mode]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
  };

  const handleFocus = () => {
    if (rawEditableState === RawEditableState.AlwaysFalse) { // to avoid default behavior being interrupted
      return;
    }
    setEditing(true);
  };

  return (
    <>
      <div
        className="markdown-body p-4 h-full rounded min-h-16"
        contentEditable={contentEditable}
        ref={contentRef}
        onFocus={handleFocus}
        onBlur={handleContentBlur}
      />
    </>
  );
}

export default TextContentDiv;