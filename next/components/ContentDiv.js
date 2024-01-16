import {useEffect, useRef, useState} from "react";
import {parseMarkdown} from "../src/util/MarkdownParser";
import {parseLaTeX} from "../src/util/LaTeXParser";

function ContentDiv({ contentInitial, onContentChange }) {
  const [content, setContent] = useState(contentInitial);
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setContent(contentInitial);
  }, [contentInitial]);

  useEffect(() => {
    if (contentRef.current) {
      if (!editing) {
        contentRef.current.innerHTML = parseMarkdown(content);
        parseLaTeX(contentRef.current);
      } else {
        contentRef.current.innerHTML = content;
      }
    }
  }, [content, editing]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
    onContentChange(newContent);
  };

  return (
    <div
      className="markdown-body"
      style={{ margin: 8, padding: 8, minHeight: 24 }}
      contentEditable="plaintext-only"
      ref={contentRef}
      onFocus={() => setEditing(true)}
      onBlur={handleContentBlur}
    ></div>
  );
}

export default ContentDiv;
