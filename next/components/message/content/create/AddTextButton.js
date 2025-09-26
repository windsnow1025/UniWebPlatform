import React from 'react';
import { Button } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { ContentTypeEnum } from "../../../../client";

function AddTextButton({ setContent }) {
  const handleAddTextContent = () => {
    setContent({ type: ContentTypeEnum.Text, data: '' });
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<TextSnippetIcon />}
      onClick={handleAddTextContent}
    >
      Add Text
    </Button>
  );
}

export default AddTextButton;