import React, {useState} from 'react';
import {
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import FilePreview from './FilePreview';
import {RawEditableState} from "../../../../lib/common/message/EditableState";
import FileLogic from "../../../../lib/common/file/FileLogic";

const FileDiv = ({fileUrl, rawEditableState, onDelete}) => {
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1] || fileUrl.split('/').pop();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleFileDelete = async () => {
    // Delete the file from storage
    try {
      const fullFileName = FileLogic.getFilenameFromUrl(fileUrl);
      const fileLogic = new FileLogic();
      await fileLogic.deleteFiles([fullFileName]);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      return;
    }

    onDelete();
  };

  if (rawEditableState === RawEditableState.AlwaysFalse) {
    return (
      <Paper key={fileUrl} className="p-2 m-2" variant="outlined">
        <Typography variant="body2" gutterBottom>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        </Typography>
        <FilePreview fileUrl={fileUrl} fileName={fileName}/>
      </Paper>
    );
  }

  return (
    <>
      <Paper key={fileUrl} className="p-2 flex-center">
        <div className="inflex-fill">
          <div className="flex-between">
            <Typography variant="body2">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                {fileName}
              </a>
            </Typography>
            <Tooltip title="Preview file">
              <IconButton onClick={() => setPreviewOpen(true)} size="small">
                <VisibilityIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {onDelete && (
          <div className="self-end">
            <Tooltip title="Remove file">
              <IconButton onClick={handleFileDelete} size="small" color="error">
                <RemoveCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Paper>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h6">{fileName}</Typography>
            <IconButton edge="end" color="inherit" onClick={() => setPreviewOpen(false)}>
              <CloseIcon/>
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <FilePreview fileUrl={fileUrl} fileName={fileName}/>
        </DialogContent>
        <DialogActions>
          <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer">Open in New Tab</Button>
        </DialogActions>
      </Dialog>

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
};

export default FileDiv;
