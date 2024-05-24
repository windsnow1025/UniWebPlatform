import {useEffect, useRef, useState} from "react";
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";

function ContentDiv({
                      contentInitial,
                      onContentChange,
                      shouldSanitize = true,
                      editableState = "conditional"
                    }) {
  const [content, setContent] = useState(contentInitial);
  const [contentEditable, setContentEditable] = useState("plaintext-only");
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setContent(contentInitial);
  }, [contentInitial]);

  const processMarkdown = async (content, editing, shouldSanitize, editableState) => {
    if (!contentRef.current) {
      return;
    }

    if (editableState === "always-false") {
      setContentEditable("false");
    } else {
      setContentEditable("plaintext-only");
    }

    if (editing || editableState === "always-true") {
      contentRef.current.innerHTML = content;
    } else if (!editing) {
      contentRef.current.innerHTML = await parseMarkdown(content, shouldSanitize);
      parseLaTeX(contentRef.current);
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, shouldSanitize, editableState);
  }, [content, editing, shouldSanitize, editableState]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
    onContentChange(newContent);
  };

  return (
    <div>
      <div
        className="markdown-body p-4 min-h-24 rounded"
        contentEditable={contentEditable}
        ref={contentRef}
        onFocus={() => setEditing(true)}
        onBlur={handleContentBlur}
      />
    </div>
  );
}

export default ContentDiv;
