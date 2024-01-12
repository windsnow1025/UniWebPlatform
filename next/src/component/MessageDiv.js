import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import {IconButton} from "@mui/material";

function MessageDiv({ roleInitial, contentInitial, onRoleChange, onContentChange, useRoleSelect, onContentDelete }) {
  const handleContentCopy = () => {
    navigator.clipboard.writeText(contentInitial);
  }

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
        {onContentDelete &&
          <div className="Flex-Column inFlex-flex-end">
            <IconButton aria-label="copy" onClick={handleContentCopy}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="delete" onClick={onContentDelete}>
              <RemoveCircleOutlineIcon fontSize="small"/>
            </IconButton>
          </div>
        }
      </div>
    </div>
  );
}

export default MessageDiv;
