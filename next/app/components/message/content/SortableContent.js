import React from 'react';
import { Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextContent from "./text/TextContent";
import {RawEditableState} from "../../../../src/conversation/chat/Message";
import SortableFiles from "./file/SortableFiles";

function SortableContent({
                           id,
                           type,
                           content,
                           files,
                           onChange,
                           onDelete,
                           shouldSanitize,
                           rawEditableState,
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
    transition,
    touchAction: 'none',
  };

  const handleCopy = () => {
    if (type === 'text') {
      navigator.clipboard.writeText(content);
    }
  };

  if (rawEditableState === RawEditableState.AlwaysFalse && type === 'text') {
    return (
      <div ref={setNodeRef} style={style} className="my-1">
        <Paper elevation={3} className="p-2">
          {type === 'text' ? (
            <TextContent
              content={content}
              setContent={onChange}
              shouldSanitize={shouldSanitize}
              rawEditableState={rawEditableState}
            />
          ) : (
            <SortableFiles
              files={files}
              setFiles={onChange}
            />
          )}
        </Paper>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="my-1">
      <Paper elevation={3} className="p-2">
        <div className="flex items-center mb-2">
          <div {...attributes} {...listeners} className="cursor-move mr-2 flex">
            <DragIndicatorIcon fontSize="small"/>
          </div>

          <div className="flex-grow font-semibold">
            {type === 'text' ? 'Text Content' : 'Grouped File Content'}
          </div>

          {type === 'text' && (
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

        {type === 'text' ? (
          <TextContent
            content={content}
            setContent={onChange}
            shouldSanitize={shouldSanitize}
            rawEditableState={rawEditableState}
          />
        ) : (
          <SortableFiles
            files={files}
            setFiles={onChange}
          />
        )}
      </Paper>
    </div>
  );
}

export default SortableContent;