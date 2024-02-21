import React, {useRef} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, Paper, Tooltip} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileService from "../../../src/service/FileService";

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
      <div className="flex-between">
        <div className="inflex-fill">
          <ContentDiv
            contentInitial={contentInitial}
            onContentChange={onContentChange}
            shouldSanitize={shouldSanitize}
          />
        </div>
        <div className="flex-column inflex-end">
          {onFileUpload &&
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{display: 'none'}}
              />
              <Tooltip title="Upload">
                <IconButton aria-label="upload" onClick={triggerFileInput}>
                  <AttachFileIcon/>
                </IconButton>
              </Tooltip>
            </>
          }
          <Tooltip title="Copy">
            <IconButton aria-label="copy" onClick={handleContentCopy}>
              <ContentCopyIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
          {onMessageDelete &&
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={onMessageDelete}>
                <RemoveCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          }
        </div>
      </div>
      <div>
        {filesInitial && filesInitial.map((file, index) => (
          <div key={index}>
            <picture>
              <img
                key={index}
                src={file}
                alt="file"
                className="max-w-full"
              />
            </picture>
          </div>
        ))}
      </div>
    </Paper>
  );
}

export default MessageDiv;
