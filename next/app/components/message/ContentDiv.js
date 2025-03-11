import {useEffect, useRef, useState} from "react";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";
import FileLogic from "../../../src/common/file/FileLogic";
import {ContentEditable, RawEditableState} from "../../../src/conversation/chat/Message";
import {Alert, Snackbar, useTheme} from "@mui/material";

function ContentDiv({
                      content,
                      setContent,
                      shouldSanitize = true,
                      rawEditableState = RawEditableState.InteractionBased,
                      files,
                      setFiles,
                      setUploadProgress,
                    }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

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
    applyTheme(mode);

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
  }, [content, editing, shouldSanitize, rawEditableState, mode]);

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
    const filesToUpload = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          filesToUpload.push(file);
        }
      }
    }

    if (filesToUpload.length === 0) {
      return;
    }

    event.preventDefault();

    setUploadProgress(0);
    try {
      const urls = await fileLogic.uploadFiles(filesToUpload, (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        setUploadProgress(progress);
      });

      setFiles([...files, ...urls]);
      setAlertMessage("Files uploaded successfully");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error("File upload failed:", error);
      setAlertMessage(error.message || "Failed to upload files");
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
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