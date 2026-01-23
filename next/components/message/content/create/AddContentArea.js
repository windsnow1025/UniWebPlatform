import React, {useState} from 'react';
import {Divider} from "@mui/material";
import FilesUpload from './FilesUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';
import UrlAdd from './UrlAdd';
import {ContentTypeEnum} from "../../../../client/nest";
import AddTextButton from "./AddTextButton";
import useScreenSize from "../../../common/hooks/useScreenSize";

function AddContentArea({contents, setContents}) {
  const screenSize = useScreenSize();
  const xsScreen = screenSize === 'xs';

  const [isUploading, setIsUploading] = useState(false);

  const handleAddFiles = (fileUrls) => {
    setContents(prevContents => {
      const newContents = [...prevContents];

      fileUrls.forEach(fileUrl => {
        newContents.push({
          type: ContentTypeEnum.File,
          data: fileUrl
        });
      });

      return newContents;
    });
  };

  return (
    <div className="mt-2">
      <Divider/>

      <div className="flex pt-2">
        <div className="flex-center">
          <AddTextButton
            setContent={(content) => setContents([...contents, content])}
          />
        </div>

        <Divider orientation="vertical" flexItem sx={{ml: 1}}/>

        <div className="flex-center inflex-fill">
          <FilesUpload
            onFilesUpload={handleAddFiles}
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

          {xsScreen ? null : (
            <div className="flex-1">
              <FileDropZone
                setFiles={handleAddFiles}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddContentArea;