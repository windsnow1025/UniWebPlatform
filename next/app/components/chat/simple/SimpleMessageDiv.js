import React from 'react';
import {Avatar, Box, Paper, Typography} from "@mui/material";
import ContentDiv from "../../message/ContentDiv";
import {EditableState} from "../../../../src/conversation/chat/Message";

function SimpleMessageDiv({
                            role,
                            content,
                          }) {
  let editableState = EditableState.AlwaysFalse;
  if (role === 'user') {
    editableState = EditableState.AlwaysTrue;
  }

  return (
    <Box
      className={`flex my-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {role !== 'user' && (
        <Avatar className="mr-2">
          {role.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <Paper
        elevation={2}
        className={`w-3/4 rounded-lg`}
      >
        {role === 'user' ? (
          <div className="m-4 whitespace-pre-wrap">
            {content}
          </div>
        ) : (
          <ContentDiv
            content={content}
            setContent={() => {}}
            shouldSanitize={true}
            editableState={editableState}
          />
        )}
      </Paper>
      {role === 'user' && (
        <Avatar className="ml-2">
          {role.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Box>
  );
}

export default SimpleMessageDiv;