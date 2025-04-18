import {useEffect, useRef, useState} from "react";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";
import {ContentEditable, RawEditableState} from "@/lib/common/message/EditableState";
import {useTheme} from "@mui/material";

function TextContent({
                      content,
                      setContent,
                      rawEditableState,
                    }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [contentEditable, setContentEditable] = useState(ContentEditable.PlainTextOnly);
  const contentRef = useRef(null);

  const parse = (content) => {
    parseMarkdownLaTeX(contentRef.current, content, true);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = content;
  }

  const processMarkdown = async (content, editableState) => {
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
    processMarkdown(content, rawEditableState);
  }, [content, rawEditableState, mode]);

  const handleBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
  };

  return (
    <>
      <div
        className="markdown-body p-4 h-full rounded min-h-16"
        contentEditable={contentEditable}
        ref={contentRef}
        onBlur={handleBlur}
      />
    </>
  );
}

export default TextContent;