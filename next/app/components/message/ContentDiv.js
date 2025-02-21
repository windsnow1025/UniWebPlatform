import {useEffect, useRef, useState} from "react";
import {parseMarkdownLaTeX} from "markdown-latex-renderer";
import FileLogic from "../../../src/common/file/FileLogic";
import {ContentEditable, RawEditableState} from "../../../src/conversation/chat/Message";
import {Alert, Snackbar} from "@mui/material";

function ContentDiv({
                      content,
                      setContent,
                      shouldSanitize = true,
                      rawEditableState = RawEditableState.InteractionBased,
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

  const parse = (content, shouldSanitize) => {
    parseMarkdownLaTeX(contentRef.current, content, shouldSanitize);
  }
  const unparse = (content) => {
    contentRef.current.innerHTML = content;
  }

  const processMarkdown = async (content, editing, shouldSanitize, editableState) => {
    if (!contentRef.current) {
      return;
    }

    // Always False -> Parse and not allow edit
    if (editableState === RawEditableState.AlwaysFalse) {
      await parse(content, shouldSanitize);
      setContentEditable(ContentEditable.False);
      return;
    }

    // Focus or Always True -> Unparse and allow edit
    if (editing || editableState === RawEditableState.AlwaysTrue) {
      unparse(content);
      setContentEditable(ContentEditable.PlainTextOnly);
      return;
    }

    // Blur -> Parse and allow edit
    if (!editing) {
      await parse(content, shouldSanitize);
      setContentEditable(ContentEditable.True); // "plaintext-only" will lead to inconsistent display behavior with "false"
      return;
    }
  }

  useEffect(() => {
    processMarkdown(content, editing, shouldSanitize, rawEditableState);
  }, [content, editing, shouldSanitize, rawEditableState]);

  const handleContentBlur = () => {
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    setEditing(false);
  };

  const handleFocus = () => {
    if (rawEditableState === RawEditableState.AlwaysFalse) { // to avoid default behavior being interrupted
      return;
    }
    setEditing(true);
  };

  const handlePaste = async (event) => {
    if (!setFiles) {
      return;
    }

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
      if (urls.length > 0) {
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
        onFocus={handleFocus}
        onBlur={handleContentBlur}
        onPaste={handlePaste}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ContentDiv;
