import React, {useState} from 'react';
import {Box, Button, Divider} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';
import {ContentTypeEnum} from "../../../../client";

function AddContentArea({contents, setContents}) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddTextContent = () => {
    setContents([
      ...contents,
      {type: ContentTypeEnum.Text, data: ''}
    ]);
  };

  const handleAddFiles = (fileUrls) => {
    const newContents = [...contents];

    fileUrls.forEach(fileUrl => {
      newContents.push({
        type: ContentTypeEnum.File,
        data: fileUrl
      });
    });

    setContents(newContents);
  };

  return (
    <Box sx={{mt: 2}}>
      <Divider/>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
      }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<TextSnippetIcon/>}
          onClick={handleAddTextContent}
          sx={{mr: 1}}
          disabled={isUploading}
        >
          Add Text
        </Button>

        <FileUpload
          files={files}
          setFiles={(newFiles) => {
            setFiles(newFiles);
            const addedFiles = newFiles.slice(files.length);
            if (addedFiles.length > 0) {
              handleAddFiles(addedFiles);
            }
          }}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />

        <AudioRecord
          setFile={(fileUrl) => handleAddFiles([fileUrl])}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />

        <div className="flex-1 ml-1">
          <FileDropZone
            setFiles={handleAddFiles}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </div>
      </Box>
    </Box>
  );
}

export default AddContentArea;