import React, {useState} from 'react';
import {IconButton, Paper, Tooltip, Typography} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilePreviewDialog from './FilePreviewDialog';

const FileDiv = ({fileUrl, files, setFiles}) => {
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1];
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileDelete = () => {
    setFiles(files.filter(file => file !== fileUrl));
  };

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
            <IconButton onClick={handleFileDelete} size="small">
              <RemoveCircleOutlineIcon fontSize="small"/>
            </IconButton>
          </div>
        )}
      </Paper>

      <FilePreviewDialog
        fileUrl={fileUrl}
        fileName={fileName}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default FileDiv;