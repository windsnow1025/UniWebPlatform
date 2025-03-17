import React, {useEffect, useState} from "react";
import {Alert, CircularProgress, IconButton, Snackbar, Tooltip, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileLogic from "../../../../src/common/file/FileLogic";
import FileDiv from "../../message/content/file/FileDiv";

const StorageSettings = () => {
  const fileLogic = new FileLogic();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const fetchedFiles = await fileLogic.fetchFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setAlertMessage("Failed to fetch files");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (fileUrl) => {
    const fileName = fileUrl.split("/").pop();
    setDeleting(true);
    try {
      await fileLogic.deleteFiles([fileName]);
      fetchFiles();
      setAlertMessage("File deleted successfully");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error deleting file:", error);
      setAlertMessage("Failed to delete file");
      setAlertSeverity("error");
    } finally {
      setDeleting(false);
      setAlertOpen(true);
    }
  };

  return (
    <div>
      <h2>Storage Settings</h2>

      <div className="my-2">
        {loading ? (
          <CircularProgress />
        ) : files.length > 0 ? (
          files.map((fileUrl) => (
            <div key={fileUrl} className="flex-center">
              <div className="inflex-fill">
                <FileDiv fileUrl={fileUrl} files={files} />
              </div>
              <Tooltip title="Delete File">
                <IconButton
                  aria-label="delete-file"
                  onClick={() => handleFileDelete(fileUrl)}
                  disabled={deleting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StorageSettings;