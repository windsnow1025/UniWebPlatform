import {useEffect, useRef, useState} from "react";
import {parseMarkdownLaTeX} from "markdown-latex-renderer";
import FileLogic from "../../../src/common/file/FileLogic";
import {EditableState} from "../../../src/conversation/chat/Message";

function ContentDiv({
                      content,
                      setContent,
                      shouldSanitize = true,
                      editableState = EditableState.InteractionBased,
                      files,
                      setFiles,
                      setUploadProgress,
                    }) {
  const [contentEditable, setContentEditable] = useState("plaintext-only");
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);

  const unparse = (content) => {
    contentRef.current.innerHTML = content;
  }

  const parse = (content, shouldSanitize) => {
    parseMarkdownLaTeX(contentRef.current, content, shouldSanitize);
  }

  const processMarkdown = async (content, editing, shouldSanitize, editableState) => {
    if (!contentRef.current) {
      return;
    }

    if (editableState === EditableState.AlwaysFalse) {
      await parse(content, shouldSanitize);
      setContentEditable("false");
      return;
    }

    // Focus and unparse
    if (editing || editableState === EditableState.AlwaysTrue) {
      unparse(content);
      setContentEditable("plaintext-only");
      return;
    }

    // Blur and parse
    if (!editing) {
      await parse(content, shouldSanitize);
      setContentEditable("true");
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, shouldSanitize, editableState);
  }, [content, editing, shouldSanitize, editableState]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
  };

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    const fileLogic = new FileLogic();
    const uploadPromises = [];
    let totalProgress = 0;
    let filePasted = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        filePasted = true;
        const file = item.getAsFile();
        if (file) {
          const uploadPromise = fileLogic.upload(file, (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total);
            totalProgress += progress / items.length;
            setUploadProgress(totalProgress);
          }).then(url => url);
          uploadPromises.push(uploadPromise);
        }
      }
    }

    if (filePasted) {
      event.preventDefault();
    }

    try {
      const urls = await Promise.all(uploadPromises);
      setFiles([...files, ...urls]);
      setUploadProgress(0);
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className="markdown-body p-4 min-h-36 rounded"
      contentEditable={contentEditable}
      ref={contentRef}
      onFocus={() => setEditing(true)}
      onBlur={handleContentBlur}
      onPaste={handlePaste}
    />
  );
}

export default ContentDiv;