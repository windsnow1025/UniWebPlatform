import {useEffect, useRef, useState} from "react";
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";

function ContentDiv({contentInitial, onContentChange, shouldSanitize}) {
  const [content, setContent] = useState(contentInitial);
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setContent(contentInitial);
  }, [contentInitial]);

  useEffect(() => {
    if (contentRef.current) {
      if (!editing) {
        contentRef.current.innerHTML = parseMarkdown(content, shouldSanitize);
        parseLaTeX(contentRef.current);
      } else {
        contentRef.current.innerHTML = content;
      }
    }
  }, [content, editing, shouldSanitize]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
    onContentChange(newContent);
  };

  return (
    <div className="my-2">
      <div
        className="markdown-body p-4 min-h-16 rounded"
        contentEditable="plaintext-only"
        ref={contentRef}
        onFocus={() => setEditing(true)}
        onBlur={handleContentBlur}
      />
    </div>
  );
}

export default ContentDiv;
