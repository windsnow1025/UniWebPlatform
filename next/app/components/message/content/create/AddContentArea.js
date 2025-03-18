import React, {useState} from 'react';
import {Button, Box, Divider} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';
import {ContentTypeEnum} from "../../../../../client";

function AddContentArea({message, setMessage}) {
  const handleAddTextContent = () => {
    setMessage({
      ...message,
      contents: [...message.contents, {type: ContentTypeEnum.Text, data: ''}]
    });
  };

  const handleAddFiles = (fileUrls) => {
    const newContents = [...message.contents];

    fileUrls.forEach(fileUrl => {
      newContents.push({
        type: ContentTypeEnum.File,
        data: fileUrl
      });
    });

    setMessage({
      ...message,
      contents: newContents
    });
  };

  const [files, setFiles] = useState([]);

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
        >
          Add Text
        </Button>

        <FileUpload
          files={files}
          setFiles={(newFiles) => {
            setFiles(newFiles);
            handleAddFiles(newFiles.slice(files.length));
          }}
        />

        <AudioRecord setFile={(fileUrl) => handleAddFiles([fileUrl])}/>

        <div className="flex-1 ml-1">
          <FileDropZone setFiles={handleAddFiles}/>
        </div>
      </Box>
    </Box>
  );
}

export default AddContentArea;