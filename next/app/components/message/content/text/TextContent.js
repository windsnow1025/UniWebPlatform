import {useEffect, useRef, useState} from "react";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";
import {ContentEditable, RawEditableState} from "@/src/common/message/EditableState";
import {useTheme} from "@mui/material";

function TextContent({
                      content,
                      setContent,
                      rawEditableState,
                    }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [contentEditable, setContentEditable] = useState("plaintext-only");
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  const parse = (content) => {
    parseMarkdownLaTeX(contentRef.current, content, true);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = content;
  }

  const processMarkdown = async (content, editing, editableState) => {
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

    // Focus or Always True -> Unparse and allow edit
    if (editing || editableState === RawEditableState.AlwaysTrue) {
      unparse(content);
      setContentEditable(ContentEditable.PlainTextOnly);
      return;
    }

    // Blur -> Parse and allow edit
    if (!editing) {
      parse(content);
      setContentEditable(ContentEditable.True); // "plaintext-only" will lead to inconsistent display behavior with "false"
      return;
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, rawEditableState);
  }, [content, editing, rawEditableState, mode]);

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

export default TextContent;