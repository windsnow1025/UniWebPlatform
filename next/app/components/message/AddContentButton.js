import React from 'react';
import { Button } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {ContentTypeEnum} from "../../../client";

function AddContentButtons({ message, setMessage }) {
  const handleAddContent = (type) => {
    setMessage({
      ...message,
      contents: [...message.contents, { type, data: '' }]
    });
  };

  return (
    <div className="flex justify-center gap-3 mt-4">
      <Button
        variant="outlined"
        size="small"
        startIcon={<TextSnippetIcon />}
        onClick={() => handleAddContent(ContentTypeEnum.Text)}
      >
        Add Text Content
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AttachFileIcon />}
        onClick={() => handleAddContent(ContentTypeEnum.File)}
      >
        Add File Content
      </Button>
    </div>
  );
}

export default AddContentButtons;