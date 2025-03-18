import React, { useState } from 'react';
import { Button } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ContentTypeEnum } from "../../../client";
import FileContentDialog from './content/file/FileContentDialog';

function AddContentButtons({ message, setMessage }) {
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  const handleAddTextContent = () => {
    setMessage({
      ...message,
      contents: [...message.contents, { type: ContentTypeEnum.Text, data: '' }]
    });
  };

  const handleAddFileContent = () => {
    setFileDialogOpen(true);
  };

  const handleFileSelected = (fileUrl) => {
    setMessage({
      ...message,
      contents: [...message.contents, { type: ContentTypeEnum.File, data: fileUrl }]
    });
  };

  return (
    <>
      <div className="flex justify-center gap-3 mt-4">
        <Button
          variant="outlined"
          size="small"
          startIcon={<TextSnippetIcon />}
          onClick={handleAddTextContent}
        >
          Add Text Content
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AttachFileIcon />}
          onClick={handleAddFileContent}
        >
          Add File Content
        </Button>
      </div>

      <FileContentDialog
        open={fileDialogOpen}
        onClose={() => setFileDialogOpen(false)}
        onFileSelected={handleFileSelected}
      />
    </>
  );
}

export default AddContentButtons;