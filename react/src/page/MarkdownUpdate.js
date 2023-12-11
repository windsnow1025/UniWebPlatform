import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { applyTheme } from "../manager/ThemeManager";
import { parseLaTeX, parseMarkdown } from '../util/MarkdownParser';
import { MarkdownManager } from '../manager/MarkdownManager';
import '../asset/css/markdown.css';

function MarkdownUpdate() {
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const markdownRef = useRef(null);
  const markdownManager = useRef(null);

  useEffect(() => {
    applyTheme(localStorage.getItem("theme"));
    markdownManager.current = new MarkdownManager(id);

    const fetchMarkdown = async () => {
      await markdownManager.current.fetchMarkdown();
      setMarkdown({
        title: markdownManager.current.title,
        content: markdownManager.current.content
      });
      document.title = markdownManager.current.title;
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      markdownManager.current.content = markdownRef.current.innerText;
      setMarkdown({
        title: markdownManager.current.title,
        content: markdownManager.current.content
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    await markdownManager.current.updateMarkdown();
    setMarkdown({
      title: markdownManager.current.title,
      content: parseMarkdown(markdownManager.current.content)
    });
    parseLaTeX(markdownRef.current);
  };

  const handleDelete = async () => {
    await markdownManager.current.deleteMarkdown();
  };

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{ padding: '16px' }}
        contentEditable={isEditing ? "plaintext-only" : "false"}
        dangerouslySetInnerHTML={{ __html: isEditing ? markdown.content : parseMarkdown(markdown.content) }}
      />

      <div className="center">
        {!isEditing && <button onClick={handleEdit}>Edit</button>}
        {isEditing && <button onClick={handleConfirm}>Confirm</button>}
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default MarkdownUpdate;
