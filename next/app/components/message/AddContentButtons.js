import React, { useState } from 'react';
import { Button } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileContentDialog from './content/file/FileContentDialog';
import {ContentTypeEnum} from "../../../client";

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

  const handleFileSelected = (fileUrls) => {
    const newContents = [...message.contents];

    fileUrls.forEach(fileUrl => {
      newContents.push({
        type: ContentTypeEnum.File,
        data: fileUrl
      });
    });

    setMessage({
      ...message,
      contents: newContents
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