import React, {useRef} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileService from "../service/FileService";

function MessageDiv({
                      roleInitial,
                      contentInitial,
                      onRoleChange,
                      onContentChange,
                      useRoleSelect,
                      onContentDelete,
                      useFileUpload
                    }) {
  const fileInputRef = useRef(null);
  const fileService = new FileService();

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) {
      try {
        const response = await fileService.upload(file);

        // Append file URL to the content
        const fileUrl = response.url;
        const updatedContent = `${contentInitial}\n${fileUrl}`;
        onContentChange(updatedContent);
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
    <div className="message_div">
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
          />
        </div>
        <div className="Flex-Column inFlex-flex-end">
          {useFileUpload &&
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <IconButton aria-label="upload" onClick={triggerFileInput}>
                <UploadIcon />
              </IconButton>
            </>
          }
          <IconButton aria-label="copy" onClick={handleContentCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          {onContentDelete &&
            <IconButton aria-label="delete" onClick={onContentDelete}>
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
          }
        </div>
      </div>
    </div>
  );
}

export default MessageDiv;
