import React, { useEffect, useState } from 'react';
import mime from 'mime';
import { codeFileExtensions } from "../../../../lib/common/message/CodeFileExtensions";
import { Typography } from '@mui/material';

const FilePreview = ({ fileUrl, fileName }) => {
  const mimeType = mime.getType(fileUrl);
  const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTextContent = async () => {
      if (codeFileExtensions.has(fileExtension)) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const text = await response.text();
          setTextContent(text);
        } catch (err) {
          setError('Could not load text content: ' + err.message);
          setTextContent('');
        } finally {
          setIsLoading(false);
        }
      } else {
        setTextContent('');
        setIsLoading(false);
        setError(null);
      }
    };

    fetchTextContent();
  }, [fileUrl, fileExtension]);

  const isText = codeFileExtensions.has(fileExtension);
  const isPdf = !isText && mimeType === 'application/pdf';
  const isImage = !isText && !isPdf && mimeType?.startsWith('image/');
  const isAudio = !isText && !isPdf && !isImage && mimeType?.startsWith('audio/');
  const isVideo = !isText && !isPdf && !isImage && !isAudio && mimeType?.startsWith('video/');

  if (isLoading) {
    return <Typography variant="body2">Loading preview...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>;
  }

  if (isText) {
    // Use pre for text content to preserve formatting
    return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '400px', overflowY: 'auto' }}>{textContent}</pre>;
  }
  if (isPdf) {
    // Added height for better default display
    return <object data={fileUrl} type="application/pdf" className="max-w-full" style={{minHeight: '400px', width: '100%'}}>Your browser does not support PDF preview.</object>;
  }
  if (isImage) {
    return <img src={fileUrl} alt={fileName} className="max-w-full" style={{ display: 'block', maxHeight: '400px' }} />;
  }
  if (isAudio) {
    return <audio controls className="max-w-full"><source src={fileUrl} type={mimeType} />Your browser does not support audio preview.</audio>;
  }
  if (isVideo) {
    return <video controls className="max-w-full" style={{ maxHeight: '400px' }}><source src={fileUrl} type={mimeType} />Your browser does not support video preview.</video>;
  }
  return <Typography variant="body2">Preview Unavailable</Typography>;
};

export default FilePreview;