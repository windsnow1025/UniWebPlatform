import React from 'react';
import {IconButton, Paper, Typography} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import mime from 'mime';

const FileDiv = ({fileUrl, files, setFiles}) => {
  const mimeType = mime.getType(fileUrl);
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1];

  const handleFileDelete = () => {
    if (setFiles) {
      const newFiles = files.filter(file => file !== fileUrl);
      setFiles(newFiles);
    }
  };

  const renderDeleteIcon = () => {
    if (setFiles) {
      return (
        <IconButton aria-label="delete-file" onClick={handleFileDelete}>
          <RemoveCircleOutlineIcon fontSize="small"/>
        </IconButton>
      );
    }
    return null;
  };

  if (mimeType && mimeType.startsWith('image/')) {
    return (
      <Paper key={fileUrl} className="flex p-2 m-2">
        <div className="inflex-fill">
          <img src={fileUrl} alt={fileName} className="max-w-full"/>
        </div>
        <div className="self-end flex">
          <IconButton
            aria-label="download-image"
            component="a"
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GetAppIcon fontSize="small"/>
          </IconButton>
          {renderDeleteIcon()}
        </div>
      </Paper>
    );
  } else {
    return (
      <Paper key={fileUrl} className="flex-center p-2 m-2">
        <Typography variant="body2">
          {fileName}
        </Typography>
        <IconButton
          aria-label="download-file"
          component="a"
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GetAppIcon fontSize="small"/>
        </IconButton>
        {renderDeleteIcon()}
      </Paper>
    );
  }
};

export default FileDiv;