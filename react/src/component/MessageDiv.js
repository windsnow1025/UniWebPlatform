import React, { useState, useEffect, useRef } from 'react';
import { parseMarkdown, parseLaTeX } from "../util/MarkdownParser";

function MessageDiv({ roleInitial, contentInitial, onRoleChange, onContentChange }) {
  const [role, setRole] = useState(roleInitial);
  const [content, setContent] = useState(contentInitial);
  const contentRef = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setRole(roleInitial);
  }, [roleInitial]);

  useEffect(() => {
    setContent(contentInitial);
  }, [contentInitial]);

  useEffect(() => {
    if (contentRef.current) {
      if (!editing) {
        // Parse and display formatted content when not editing
        contentRef.current.innerHTML = parseMarkdown(content);
        parseLaTeX(contentRef.current);
      } else {
        // Display raw markdown content while editing
        contentRef.current.textContent = content;
      }
    }
  }, [content, editing]);

  const handleRoleChange = (event) => {
    const newRole = event.target.textContent;
    setRole(newRole);
    onRoleChange(newRole);
  };

  const handleContentChange = () => {
    const newContent = contentRef.current.textContent;
    setContent(newContent);
    onContentChange(newContent);
    setEditing(false);
  };

  return (
    <div className="message_div">
      <div
        contentEditable="plaintext-only"
        onBlur={handleRoleChange}
        dangerouslySetInnerHTML={{ __html: role }}
      ></div>
      <div className="Flex-space-between">
        <div className="inFlex-FillSpace">
          <div
            className="markdown-body"
            style={{ margin: '8px', padding: '8px', minHeight: '24px' }}
            contentEditable="plaintext-only"
            ref={contentRef}
            onFocus={() => setEditing(true)}
            onBlur={handleContentChange}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MessageDiv;
