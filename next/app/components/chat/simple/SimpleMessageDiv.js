import React from 'react';
import {Avatar, Box, Paper, Typography} from "@mui/material";
import ContentDiv from "../../message/ContentDiv";

function SimpleMessageDiv({
                            role,
                            content,
                            setContent,
                          }) {
  let editableState = "always-false";
  if (role === 'user') {
    editableState = "always-true";
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
        className={`p-4 w-3/4 rounded-lg`}
      >
        {role === 'user' ? (
          <Typography variant="body1">
            {content}
          </Typography>
        ) : (
          <ContentDiv
            content={content}
            setContent={setContent}
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