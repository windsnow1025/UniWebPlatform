import React, { useState, useEffect, useRef } from 'react';
import { parseMarkdown, parseLaTeX } from "../util/MarkdownParser";

function MessageDiv({ roleInitial, contentInitial, onRoleChange, onContentChange }) {
  const [role, setRole] = useState(roleInitial);
  const [content, setContent] = useState(contentInitial);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = parseMarkdown(content);
      parseLaTeX(contentRef.current);
    }
  }, [content]);

  const handleRoleChange = (event) => {
    const newRole = event.target.innerHTML;
    setRole(newRole);
    onRoleChange(newRole);
  };

  const handleContentChange = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    onContentChange(newContent);
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
            onBlur={handleContentChange}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MessageDiv;
