import {useEffect, useRef, useState} from "react";
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";

function ContentDiv({
                      content,
                      setContent,
                      shouldSanitize = true,
                      editableState = "conditional"
                    }) {
  const [contentEditable, setContentEditable] = useState("plaintext-only");
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  const processMarkdown = async (content, editing, shouldSanitize, editableState) => {
    if (!contentRef.current) {
      return;
    }

    if (editableState === "always-false") {
      contentRef.current.innerHTML = await parseMarkdown(content, shouldSanitize);
      parseLaTeX(contentRef.current);
      setContentEditable("false");
      return;
    }

    // Focus and unparse
    if (editing || editableState === "always-true") {
      contentRef.current.innerHTML = content;
      setContentEditable("plaintext-only");
      return;
    }

    // Blur and parse
    if (!editing) {
      contentRef.current.innerHTML = await parseMarkdown(content, shouldSanitize);
      parseLaTeX(contentRef.current);
      setContentEditable("true");
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, shouldSanitize, editableState);
  }, [content, editing, shouldSanitize, editableState]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
  };

  return (
    <div>
      <div
        className="markdown-body p-4 min-h-36 rounded"
        contentEditable={contentEditable}
        ref={contentRef}
        onFocus={() => setEditing(true)}
        onBlur={handleContentBlur}
      />
    </div>
  );
}

export default ContentDiv;
