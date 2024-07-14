import React from 'react';
import { Box, Paper, Avatar } from "@mui/material";
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
      display="flex"
      justifyContent={role === 'user' ? 'flex-end' : 'flex-start'}
      alignItems="flex-start"
      my={1}
    >
      {role !== 'user' && (
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
          {role.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          width: "75%",
          borderRadius: 2,
          backgroundColor: role === 'user' ? 'primary.main' : 'background.paper'
        }}
      >
        <ContentDiv
          content={content}
          setContent={setContent}
          shouldSanitize={true}
          editableState={editableState}
        />
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