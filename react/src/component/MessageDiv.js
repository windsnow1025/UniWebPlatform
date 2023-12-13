import React from 'react';
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';

function MessageDiv({ roleInitial, contentInitial, onRoleChange, onContentChange, useSelect }) {
  return (
    <div className="message_div">
      {useSelect ?
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
      </div>
    </div>
  );
}

export default MessageDiv;
