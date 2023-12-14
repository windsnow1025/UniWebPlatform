import {useEffect, useRef, useState} from "react";
import {parseLaTeX, parseMarkdown} from "../util/MarkdownParser";

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
        contentRef.current.textContent = content;
      }
    }
  }, [content, editing]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.textContent;
    setContent(newContent);
    onContentChange(newContent);
    setEditing(false);
  };

  const handleContentChange = () => {
    const newContent = contentRef.current.textContent;
    setContent(newContent);
    onContentChange(newContent);
  }

  return (
    <div
      className="markdown-body"
      style={{ margin: '8px', padding: '8px', minHeight: '24px' }}
      contentEditable="plaintext-only"
      ref={contentRef}
      onFocus={() => setEditing(true)}
      onInput={handleContentChange}
      onBlur={handleContentBlur}
    ></div>
  );
}

export default ContentDiv;
