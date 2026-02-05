import React, {useEffect, useState} from "react";
import {Alert, Button, Checkbox, CircularProgress, FormControlLabel, Snackbar, Switch, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileLogic from "../../../lib/common/file/FileLogic";
import FileDiv from "../../message/content/file/FileDiv";
import FilesUpload from "../../message/content/create/FilesUpload";
import UserLogic from "../../../lib/common/user/UserLogic";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import PromptLogic from "../../../lib/prompt/PromptLogic";

const StorageSettings = () => {
  const fileLogic = new FileLogic();

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Admin Upload
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Orphaned files filter
  const [showOrphanedOnly, setShowOrphanedOnly] = useState(false);
  const [referencedFiles, setReferencedFiles] = useState(new Set());

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const conversationLogic = new ConversationLogic();
  const promptLogic = new PromptLogic();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const userLogic = new UserLogic();
    const checkAdmin = async () => {
      try {
        const adminStatus = await userLogic.isAdmin();
        setIsAdmin(adminStatus);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    };
    checkAdmin();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const fetchedFiles = await fileLogic.fetchFiles();
      setFiles(fetchedFiles);
      setSelectedFiles(new Set());

      // Fetch referenced files
      const conversations = await conversationLogic.fetchConversations();
      const prompts = await promptLogic.fetchPrompts();

      const fileUrls = new Set();

      // Extract referenced files
      const extractFileUrlsFromContents = (contents) => {
        return contents
          .filter(content => content.type === 'file')
          .map(content => content.data);
      };

      conversations.forEach(conv => {
        conv.messages?.forEach(msg => {
          extractFileUrlsFromContents(msg.contents).forEach(url => fileUrls.add(url));
        });
      });
      prompts.forEach(sp => {
        extractFileUrlsFromContents(sp.contents).forEach(url => fileUrls.add(url));
      });

      setReferencedFiles(fileUrls);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileUrl) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileUrl)) {
      newSelected.delete(fileUrl);
    } else {
      newSelected.add(fileUrl);
    }
    setSelectedFiles(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    setDeleting(true);
    try {
      const fileNames = FileLogic.getFilenamesFromUrls(Array.from(selectedFiles));
      await fileLogic.deleteFiles(fileNames);
      fetchFiles();
      setAlertMessage(`${selectedFiles.size} file(s) deleted successfully`);
      setAlertSeverity("success");
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity("error");
    } finally {
      setDeleting(false);
      setAlertOpen(true);
    }
  };

  const handleFilesUploaded = (uploadedFileUrls) => {
    const merged = [...files, ...uploadedFileUrls];
    setFiles(merged);
    setSelectedFiles(new Set());
    setAlertMessage("Files uploaded successfully");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleOrphanedToggle = (event) => {
    setShowOrphanedOnly(event.target.checked);
    setSelectedFiles(new Set());
  };

  const displayedFiles = showOrphanedOnly
    ? files.filter(url => !referencedFiles.has(url))
    : files;

  return (
    <div>
      <h2>Storage Settings</h2>

      {isAdmin && (
        <div className="flex-normal gap-2 my-2">
          <Typography variant="body2">Upload:</Typography>
          <FilesUpload onFilesUpload={handleFilesUploaded} isUploading={isUploading} setIsUploading={setIsUploading}/>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex-center">
          <Checkbox
            checked={selectedFiles.size === displayedFiles.length && displayedFiles.length > 0}
            indeterminate={selectedFiles.size > 0 && selectedFiles.size < displayedFiles.length}
            onChange={() => {
              if (selectedFiles.size === displayedFiles.length) {
                setSelectedFiles(new Set());
              } else {
                setSelectedFiles(new Set(displayedFiles));
              }
            }}
            disabled={loading || deleting}
          />
          <Typography variant="body2">
            {selectedFiles.size > 0
              ? `${selectedFiles.size} selected`
              : 'Select All'}
          </Typography>
          <div className="ml-8">
            <FormControlLabel
              control={
                <Switch
                  checked={showOrphanedOnly}
                  onChange={handleOrphanedToggle}
                  disabled={loading || deleting}
                  size="small"
                />
              }
              label={<Typography variant="body2">Show orphaned only</Typography>}
            />
          </div>
          <div className="flex-1"/>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon/>}
            onClick={handleDeleteSelected}
            disabled={deleting || selectedFiles.size === 0}
            size="small"
          >
            Delete ({selectedFiles.size})
          </Button>
        </div>
      )}

      <div className="my-2">
        {loading ? (
          <CircularProgress/>
        ) : displayedFiles.length > 0 ? (
          displayedFiles.map((fileUrl) => (
            <div key={fileUrl} className="flex-center">
              <Checkbox
                checked={selectedFiles.has(fileUrl)}
                onChange={() => handleFileSelect(fileUrl)}
                disabled={deleting}
              />
              <div className="inflex-fill my-2">
                <FileDiv fileUrl={fileUrl}/>
              </div>
            </div>
          ))
        ) : showOrphanedOnly && files.length > 0 ? (
          <Typography>No orphaned files found.</Typography>
        ) : (
          <Typography>No files uploaded yet.</Typography>
        )}
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: "100%"}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StorageSettings;