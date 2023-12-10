import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { applyTheme } from "../manager/ThemeManager";
import { parseLaTeX, parseMarkdown } from '../util/MarkdownParser';
import { MarkdownService } from '../service/MarkdownService';
import '../markdown.css';

function MarkdownUpdate() {
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const markdownRef = useRef(null);
  const markdownService = useRef(null);

  useEffect(() => {
    applyTheme(localStorage.getItem("theme"));
    markdownService.current = new MarkdownService(id);

    const fetchMarkdown = async () => {
      await markdownService.current.fetchMarkdown();
      setMarkdown({
        title: markdownService.current.title,
        content: markdownService.current.content
      });
      document.title = markdownService.current.title;
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      markdownService.current.content = markdownRef.current.innerText;
      setMarkdown({
        title: markdownService.current.title,
        content: markdownService.current.content
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    await markdownService.current.updateMarkdown();
    setMarkdown({
      title: markdownService.current.title,
      content: parseMarkdown(markdownService.current.content)
    });
    parseLaTeX(markdownRef.current);
  };

  const handleDelete = async () => {
    await markdownService.current.deleteMarkdown();
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
