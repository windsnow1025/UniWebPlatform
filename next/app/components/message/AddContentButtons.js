import React, {useState} from 'react';
import {Button, Box} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FileUpload from './content/file/FileUpload';
import AudioRecord from './content/file/AudioRecord';
import FileDropZone from './content/file/FileDropZone';
import {ContentTypeEnum} from "../../../client";

function AddContentButtons({message, setMessage}) {
  const handleAddTextContent = () => {
    setMessage({
      ...message,
      contents: [...message.contents, {type: ContentTypeEnum.Text, data: ''}]
    });
  };

  const handleFileSelected = (fileUrls) => {
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

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px dashed #ccc',
        borderRadius: '4px',
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
            handleFileSelected(newFiles.slice(files.length));
          }}
        />

        <AudioRecord setFile={(fileUrl) => handleFileSelected([fileUrl])}/>

        <div className="flex-1">
          <FileDropZone setFile={handleFileSelected}/>
        </div>
      </Box>
    </Box>
  );
}

export default AddContentButtons;