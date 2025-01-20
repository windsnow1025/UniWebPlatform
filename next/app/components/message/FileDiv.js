import React, {useState, useEffect} from 'react';
import {IconButton, Paper, Typography} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import mime from 'mime';
import {codeFileExtensions} from "../../../src/conversation/chat/CodeFileExtensions";

const FileDiv = ({fileUrl, files, setFiles}) => {
  const mimeType = mime.getType(fileUrl);
  const fileName = fileUrl.split('/').pop().split(/-(.+)/)[1];
  const fileExtension = '.' + fileName.split('.').pop().toLowerCase();

  const [textContent, setTextContent] = useState('');

  const handleFileDelete = () => {
    const newFiles = files.filter(file => file !== fileUrl);
    setFiles(newFiles);
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
  return (
    <Paper key={fileUrl} className={`p-2 m-2 flex-center`}>
      <div className="inflex-fill">
        <Typography variant="body2">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        </Typography>
        {isImage && (
          <img src={fileUrl} alt={fileName} className="max-w-full"/>
        )}
        {isPdf && (
          <object data={fileUrl} type="application/pdf" className="max-w-full">
            Your browser does not support PDF preview.
          </object>
        )}
        {isVideo && (
          <video controls className="max-w-full">
            <source src={fileUrl} type={mimeType}/>
            Your browser does not support video preview.
          </video>
        )}
        {isAudio && (
          <audio controls className="max-w-full">
            <source src={fileUrl} type={mimeType}/>
            Your browser does not support audio preview.
          </audio>
        )}
        {isText && (
          <pre>
            {textContent}
          </pre>
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