import React, { useState, useEffect, useRef } from 'react';
import { applyTheme } from "../manager/ThemeManager";
import { parseMarkdown, parseLaTeX } from '../util/MarkdownParser';
import { MarkdownManager } from '../manager/MarkdownManager';
import '../asset/markdown.css';

function MarkdownAdd() {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const markdownService = useRef(new MarkdownManager(null));
  const markdownRef = useRef(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    applyTheme(theme);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      markdownService.current.content = markdownRef.current.innerText;
      setContent(parseMarkdown(markdownRef.current.innerText));
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const handleAdd = async () => {
    await markdownService.current.addMarkdown();
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
