import React from 'react';
import { Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ContentTypeEnum } from "../../../client";
import FileContentDiv from './FileContentDiv';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextContentDiv from "./TextContentDiv";

function ContentItemDiv({
                          id,
                          content,
                          onChange,
                          onDelete,
                          shouldSanitize,
                          rawEditableState,
                          setUploadProgress
                        }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.data);
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Paper elevation={3} className="p-2">
        <div className="flex items-center mb-2">
          <div {...attributes} {...listeners} className="cursor-move mr-2">
            <DragIndicatorIcon />
          </div>

          <div className="flex-grow font-semibold">
            {content.type === ContentTypeEnum.Text ? 'Text Content' : 'File Content'}
          </div>

          {content.type === ContentTypeEnum.Text && (
            <Tooltip title="Copy">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        {content.type === ContentTypeEnum.Text ? (
          <TextContentDiv
            content={content.data}
            setContent={onChange}
            shouldSanitize={shouldSanitize}
            rawEditableState={rawEditableState}
          />
        ) : (
          <FileContentDiv
            fileUrl={content.data}
            setFileUrl={onChange}
            setUploadProgress={setUploadProgress}
          />
        )}
      </Paper>
    </div>
  );
}

export default ContentItemDiv;