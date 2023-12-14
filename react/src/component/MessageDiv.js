import React from 'react';
import {faCopy, faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
            <FontAwesomeIcon
              icon={faCopy}
              style={{margin: "4px"}}
              title="Copy"
              onClick={handleContentCopy}>
            </FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faMinusCircle}
              style={{margin: "4px"}}
              title="Delete"
              onClick={onContentDelete}>
            </FontAwesomeIcon>
          </div>
        }
      </div>
    </div>
  );
}

export default MessageDiv;
