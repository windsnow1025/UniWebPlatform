import React from 'react';
import {IconButton, Tooltip, Typography, useTheme} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextContent from "./text/TextContent";
import { RawEditableState } from "../../../lib/common/message/EditableState";
import SortableFiles from "./file/SortableFiles";
import { SortableContentType } from "../../../lib/common/message/SortableContent";

function SortableContent({
                           id,
                           type,
                           content,
                           onChange,
                           onDelete,
                           rawEditableState,
                         }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id});

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCopy = () => {
    if (type === SortableContentType.Text) {
      navigator.clipboard.writeText(content);
    }
  };

  const theme = useTheme();

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className="p-1 rounded-md my-2"
        style={{
          backgroundColor: `${theme.palette.primary.main}20`
        }}
      >
        {rawEditableState !== RawEditableState.AlwaysFalse && (
          <div className="flex items-center">
            <div
              {...listeners}
              className="cursor-move mr-2 flex"
              style={{touchAction: 'none'}}
            >
              <DragIndicatorIcon fontSize="small"/>
            </div>

            <Typography variant="subtitle2" className="flex-grow">
              {type === SortableContentType.Text ? 'Text Content' : 'Grouped File Content'}
            </Typography>

            {type === SortableContentType.Text && (
              <Tooltip title="Copy">
                <IconButton size="small" onClick={handleCopy}>
                  <ContentCopyIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Delete">
              <IconButton size="small" onClick={onDelete} color="error">
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </div>
        )}

        <div className="m-1">
          {type === SortableContentType.Text ? (
            <TextContent
              content={content}
              setContent={onChange}
              rawEditableState={rawEditableState}
            />
          ) : (
            <SortableFiles
              files={content}
              setFiles={onChange}
              rawEditableState={rawEditableState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SortableContent;