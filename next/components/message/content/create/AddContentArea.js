import React, {useState} from 'react';
import {Box, Divider} from "@mui/material";
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';
import UrlAdd from './UrlAdd';
import {ContentTypeEnum} from "../../../../client";
import AddTextButton from "./AddTextButton";

function AddContentArea({contents, setContents, setConversationUpdateKey}) {
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

    setConversationUpdateKey(prev => prev + 1);
  };

  return (
    <div className="mt-2">
      <Divider/>

      <div className="flex pt-2">
        <div className="flex-center">
          <AddTextButton
            setContent={(content) => setContents([...contents, content])}
            disabled={isUploading}
          />
        </div>

        <Divider orientation="vertical" flexItem sx={{ml: 1}}/>

        <div className="flex-center inflex-fill">
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

          <UrlAdd
            setUrl={url => handleAddFiles([url])}
            isUploading={isUploading}
          />

          <div className="flex-1">
            <FileDropZone
              setFiles={handleAddFiles}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContentArea;