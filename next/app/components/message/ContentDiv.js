import {useEffect, useRef, useState} from "react";
import {parseMarkdownLaTeX} from "markdown-latex-renderer";
import FileLogic from "../../../src/common/file/FileLogic";
import {EditableState} from "../../../src/conversation/chat/Message";
import {Alert, Snackbar} from "@mui/material";

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

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

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
      if (!urls.length > 0) {
        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setAlertMessage(error.message || "Failed to upload file");
      setAlertSeverity('error');
      setAlertOpen(true);
      setUploadProgress(0);
    }

  };

  return (
    <>
      <div
        className="markdown-body p-4 h-full rounded min-h-16"
        contentEditable={contentEditable}
        ref={contentRef}
        onFocus={() => setEditing(true)}
        onBlur={handleContentBlur}
        onPaste={handlePaste}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ContentDiv;