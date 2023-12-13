import React, { useState, useEffect, useRef } from 'react';
import { applyTheme } from "../logic/ThemeLogic";
import { parseMarkdown, parseLaTeX } from '../util/MarkdownParser';
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';

function MarkdownAdd() {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const markdownLogic = useRef(new MarkdownLogic(null));
  const markdownRef = useRef(null);

  useEffect(() => {
    applyTheme(localStorage.getItem("theme"));
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      markdownLogic.current.content = markdownRef.current.innerText;
      setContent(parseMarkdown(markdownRef.current.innerText));
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const handleAdd = async () => {
    await markdownLogic.current.addMarkdown();
  };

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{ padding: '16px' }}
        contentEditable={isEditing ? "plaintext-only" : "false"}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="center">
        {!isEditing && <button onClick={handleEdit}>Edit</button>}
        {isEditing && <button onClick={handleConfirm}>Confirm</button>}
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}

export default MarkdownAdd;
