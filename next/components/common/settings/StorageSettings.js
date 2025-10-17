import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Snackbar,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileLogic from "../../../lib/common/file/FileLogic";
import FileDiv from "../../message/content/file/FileDiv";
import FilesUpload from "../../message/content/create/FilesUpload";
import UserLogic from "../../../lib/common/user/UserLogic";

const StorageSettings = () => {
  const fileLogic = new FileLogic();

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const userLogic = new UserLogic();
    const checkAdmin = async () => {
      try {
        const adminStatus = await userLogic.isAdmin();
        setIsAdmin(adminStatus);
      } catch (e) {
        setIsAdmin(false);
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
    } catch (error) {
      console.error("Error fetching files:", error);
      setAlertMessage(error.message);
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

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    setDeleting(true);
    try {
      const fileNames = FileLogic.getFileNamesFromUrls(Array.from(selectedFiles));
      await fileLogic.deleteFiles(fileNames);
      fetchFiles();
      setAlertMessage(`${selectedFiles.size} file(s) deleted successfully`);
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error deleting files:", error);
      setAlertMessage(error.message);
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

  return (
    <div>
      <h2>Storage Settings</h2>

      {isAdmin && (
        <div className="flex-normal gap-2 my-2">
          <Typography variant="body2">Upload:</Typography>
          <FilesUpload onFilesUpload={handleFilesUploaded} isUploading={isUploading} setIsUploading={setIsUploading} />
        </div>
      )}

      {files.length > 0 && (
        <div className="flex-normal gap-2">
          <Checkbox
            checked={selectedFiles.size === files.length && files.length > 0}
            indeterminate={selectedFiles.size > 0 && selectedFiles.size < files.length}
            onChange={handleSelectAll}
            disabled={loading || deleting}
          />
          <Typography variant="body2">
            {selectedFiles.size > 0
              ? `${selectedFiles.size} selected`
              : 'Select all'}
          </Typography>
          {selectedFiles.size > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon/>}
              onClick={handleDeleteSelected}
              disabled={deleting}
              size="small"
            >
              Delete Selected ({selectedFiles.size})
            </Button>
          )}
        </div>
      )}

      <div className="my-2">
        {loading ? (
          <CircularProgress/>
        ) : files.length > 0 ? (
          files.map((fileUrl) => (
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