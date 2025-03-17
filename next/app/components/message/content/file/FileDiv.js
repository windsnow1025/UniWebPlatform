import React, {useEffect, useState} from 'react';
import {IconButton, Paper, Tooltip, Typography} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import mime from 'mime';
import {codeFileExtensions} from "../../../../../src/conversation/chat/CodeFileExtensions";

const FileDiv = ({fileUrl, files, setFiles}) => {
  const mimeType = mime.getType(fileUrl);
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1];
  const fileExtension = '.' + fileName.split('.').pop().toLowerCase();

  const [textContent, setTextContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleFileDelete = () => {
    const newFiles = files.filter(file => file !== fileUrl);
    setFiles(newFiles);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  useEffect(() => {
    const fetchTextContent = async () => {
      if (isText) {
        try {
          const response = await fetch(fileUrl);
          const text = await response.text();
          setTextContent(text);
        } catch (error) {
          console.error('Error fetching text content:', error);
        }
      }
    };

    fetchTextContent();
  }, [fileUrl]);

  const isText = codeFileExtensions.has(fileExtension);
  const isPdf = !isText && mimeType === 'application/pdf';
  const isImage = !isText && !isPdf && mimeType && mimeType.startsWith('image/');
  const isAudio = !isText && !isPdf && !isImage && mimeType && mimeType.startsWith('audio/');
  const isVideo = !isText && !isPdf && !isImage && !isAudio && mimeType && mimeType.startsWith('video/');
  const isOthers = !isText && !isPdf && !isImage && !isAudio && !isVideo;

  return (
    <Paper key={fileUrl} className={`p-2 m-2 flex-center`}>
      <div className="inflex-fill">
        <div className="flex-between">
          <Typography variant="body2">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {fileName}
            </a>
          </Typography>
          <Tooltip title={showPreview ? "Turn on preview" : "Turn off preview"}>
            <IconButton onClick={togglePreview}>
              {showPreview ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
            </IconButton>
          </Tooltip>
        </div>
        {showPreview && (
          <div>
            {isText && (
              <pre>
                {textContent}
              </pre>
            )}
            {isPdf && (
              <object data={fileUrl} type="application/pdf" className="max-w-full">
                Your browser does not support PDF preview.
              </object>
            )}
            {isImage && (
              <img src={fileUrl} alt={fileName} className="max-w-full"/>
            )}
            {isAudio && (
              <audio controls className="max-w-full">
                <source src={fileUrl} type={mimeType}/>
                Your browser does not support audio preview.
              </audio>
            )}
            {isVideo && (
              <video controls className="max-w-full">
                <source src={fileUrl} type={mimeType}/>
                Your browser does not support video preview.
              </video>
            )}
            {isOthers && (
              <div>Preview Unavailable</div>
            )}
          </div>
        )}
      </div>
      {setFiles && (
        <div className="self-end">
          <IconButton aria-label="delete-file" onClick={handleFileDelete}>
            <RemoveCircleOutlineIcon fontSize="small"/>
          </IconButton>
        </div>
      )}
    </Paper>
  );
};

export default FileDiv;