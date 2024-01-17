import React, {useRef} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, Paper} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileService from "../../src/service/FileService";

function MessageDiv({
                      roleInitial,
                      contentInitial,
                      filesInitial,
                      onRoleChange,
                      onContentChange,
                      onFileUpload,
                      useRoleSelect,
                      onMessageDelete,
                      shouldSanitize,
                    }) {
  const fileInputRef = useRef(null);
  const fileService = new FileService();

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) {
      try {
        const response = await fileService.upload(file);
        const fileUrl = response.url;
        onFileUpload(fileUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleContentCopy = () => {
    navigator.clipboard.writeText(contentInitial);
  };

  return (
    <Paper elevation={4} className="my-1 p-2 rounded-lg">
      {useRoleSelect ?
        <RoleSelect
          roleInitial={roleInitial}
          onRoleChange={onRoleChange}
        />
        :
        <RoleDiv
          roleInitial={roleInitial}
          onRoleChange={onRoleChange}
        />
      }
      <div className="Flex-space-between">
        <div className="inFlex-FillSpace">
          <ContentDiv
            contentInitial={contentInitial}
            onContentChange={onContentChange}
            shouldSanitize={shouldSanitize}
          />
        </div>
        <div className="Flex-Column inFlex-flex-end">
          {onFileUpload &&
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{display: 'none'}}
              />
              <IconButton aria-label="upload" onClick={triggerFileInput}>
                <UploadIcon/>
              </IconButton>
            </>
          }
          <IconButton aria-label="copy" onClick={handleContentCopy}>
            <ContentCopyIcon fontSize="small"/>
          </IconButton>
          {onMessageDelete &&
            <IconButton aria-label="delete" onClick={onMessageDelete}>
              <RemoveCircleOutlineIcon fontSize="small"/>
            </IconButton>
          }
        </div>
      </div>
      <div>
        {filesInitial && filesInitial.map((file, index) => (
          <div key={index}>
            <img
              key={index}
              src={file}
              alt="file"
              className="max-w-full"
            />
          </div>
        ))}
      </div>
    </Paper>
  );
}

export default MessageDiv;
