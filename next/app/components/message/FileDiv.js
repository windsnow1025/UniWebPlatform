import React from 'react';
import { IconButton, Paper, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import mime from 'mime';

const FileDiv = ({ fileUrl, files, setFiles }) => {
  const mimeType = mime.getType(fileUrl);
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1];

  const handleFileDelete = () => {
    if (setFiles) {
      const newFiles = files.filter(file => file !== fileUrl);
      setFiles(newFiles);
    }
  };

  const isImage = mimeType && mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';
  const isVideo = mimeType && mimeType.startsWith('video/');
  const isAudio = mimeType && mimeType.startsWith('audio/');

  return (
    <Paper key={fileUrl} className={`p-2 m-2 flex`}>
      <div className="inflex-fill">
        <Typography variant="body2">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        </Typography>
        {isImage && (
          <img src={fileUrl} alt={fileName} className="max-w-full" />
        )}
        {isPdf && (
          <object data={fileUrl} type="application/pdf" className="max-w-full">
            Your browser does not support PDF preview.
          </object>
        )}
        {isVideo && (
          <video controls className="max-w-full">
            <source src={fileUrl} type={mimeType} />
            Your browser does not support video preview.
          </video>
        )}
        {isAudio && (
          <audio controls className="max-w-full">
            <source src={fileUrl} type={mimeType} />
            Your browser does not support audio preview.
          </audio>
        )}
      </div>
      {setFiles && (
        <div className="self-end">
          <IconButton aria-label="delete-file" onClick={handleFileDelete}>
            <RemoveCircleOutlineIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </Paper>
  );
};

export default FileDiv;