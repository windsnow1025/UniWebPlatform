import React, { useState } from 'react';
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
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import FilePreview from './FilePreview';
import { RawEditableState } from "../../../../../src/common/message/EditableState";

const FileDiv = ({ fileUrl, files, setFiles, rawEditableState }) => {
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1] || fileUrl.split('/').pop();
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileDelete = () => {
    setFiles(files.filter(file => file !== fileUrl));
  };

  if (rawEditableState === RawEditableState.AlwaysFalse) {
    return (
      <Paper
        key={fileUrl}
        className="p-2 m-2"
        variant="outlined"
      >
        <Typography variant="body2" gutterBottom>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        </Typography>
        <FilePreview fileUrl={fileUrl} fileName={fileName} />
      </Paper>
    );
  }

  return (
    <>
      <Paper key={fileUrl} className="p-2 m-2 flex-center">
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
        {setFiles && (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {fileName}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <FilePreview fileUrl={fileUrl} fileName={fileName} />
        </DialogContent>
        <DialogActions>
          <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer">Open in New Tab</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileDiv;