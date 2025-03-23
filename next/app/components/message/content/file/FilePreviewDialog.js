import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import mime from 'mime';
import { codeFileExtensions } from "../../../../../src/common/message/CodeFileExtensions";

const FilePreviewDialog = ({ fileUrl, fileName, open, onClose }) => {
  const mimeType = mime.getType(fileUrl);
  const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    const fetchTextContent = async () => {
      if (codeFileExtensions.has(fileExtension)) {
        try {
          const response = await fetch(fileUrl);
          const text = await response.text();
          setTextContent(text);
        } catch (error) {
          console.error('Error fetching text content:', error);
        }
      }
    };

    if (open) {
      fetchTextContent();
    }
  }, [fileUrl, open]);

  const isText = codeFileExtensions.has(fileExtension);
  const isPdf = !isText && mimeType === 'application/pdf';
  const isImage = !isText && !isPdf && mimeType?.startsWith('image/');
  const isAudio = !isText && !isPdf && !isImage && mimeType?.startsWith('audio/');
  const isVideo = !isText && !isPdf && !isImage && !isAudio && mimeType?.startsWith('video/');
  const isOthers = !isText && !isPdf && !isImage && !isAudio && !isVideo;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{fileName}</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {isText && <pre>{textContent}</pre>}
        {isPdf && <object data={fileUrl} type="application/pdf" className="max-w-full">Your browser does not support PDF preview.</object>}
        {isImage && <img src={fileUrl} alt={fileName} className="max-w-full" />}
        {isAudio && <audio controls className="max-w-full"><source src={fileUrl} type={mimeType} />Your browser does not support audio preview.</audio>}
        {isVideo && <video controls className="max-w-full"><source src={fileUrl} type={mimeType} />Your browser does not support video preview.</video>}
        {isOthers && <div>Preview Unavailable</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
        <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer">Open in New Tab</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilePreviewDialog;