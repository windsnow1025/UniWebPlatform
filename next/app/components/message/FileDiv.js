import React from 'react';
import {Typography, IconButton, Paper} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import mime from 'mime';

const FileDiv = ({fileUrl, handleFileDelete}) => {
  const mimeType = mime.getType(fileUrl);
  const fileName = fileUrl.split('/').pop().split('-').pop();

  if (mimeType && mimeType.startsWith('image/')) {
    return (
      <Paper key={fileUrl} className="flex p-2 m-2">
        <div className="grow">
          <img src={fileUrl} alt={fileName} className="max-w-full"/>
        </div>
        <div className="self-end">
          <IconButton aria-label="delete-file" onClick={() => handleFileDelete(fileUrl)}>
            <RemoveCircleOutlineIcon fontSize="small"/>
          </IconButton>
        </div>
      </Paper>
    )
  } else {
    return (
      <Paper key={fileUrl} className="flex-center p-2 m-2">
        <Typography variant="body2">
          {fileName}
        </Typography>
        <IconButton aria-label="delete-file" onClick={() => handleFileDelete(fileUrl)}>
          <RemoveCircleOutlineIcon fontSize="small"/>
        </IconButton>
      </Paper>
    );
  }
};

export default FileDiv;