import React, {useState} from 'react';
import {Box, Button, Divider} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';
import AddFileByUrlButton from './AddFileByUrlButton';
import {ContentTypeEnum} from "../../../../client";
import AddTextButton from "./AddTextButton";

function AddContentArea({contents, setContents}) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddFileByUrl = (url) => {
    setContents([
      ...contents,
      {type: ContentTypeEnum.File, data: url}
    ]);
  };

  return (
    <Box sx={{mt: 2}}>
      <Divider/>

      <div className="flex">
        <div className="flex-center mt-1.5">
          <AddTextButton
            setContent={(content) => setContents([...contents, content])}
            disabled={isUploading}
          />
        </div>

        <Divider orientation="vertical" flexItem sx={{ ml: 1 }} />

        <div className="flex-center mt-1.5 inflex-fill">
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

          <AddFileByUrlButton
            setUrl={handleAddFileByUrl}
            disabled={isUploading}
          />

          <div className="flex-1 m-1">
            <FileDropZone
              setFiles={handleAddFiles}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default AddContentArea;