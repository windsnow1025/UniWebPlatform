import React from 'react';
import RoleDiv from './RoleDiv';
import ContentDiv from './ContentDiv';

function MessageDiv({ roleInitial, contentInitial, onRoleChange, onContentChange }) {
  return (
    <div className="message_div">
      <RoleDiv
        roleInitial={roleInitial}
        onRoleChange={onRoleChange}
      />
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

