import React from 'react';
import {IconButton, Paper, Tooltip, useTheme} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
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
  };

  const handleCopy = () => {
    if (type === 'text') {
      navigator.clipboard.writeText(content);
    }
  };

  const theme = useTheme();

  return (
    <div ref={setNodeRef} style={style} className="my-2">
      <div
        className="p-1 rounded-md"
        style={{
          backgroundColor: `${theme.palette.primary.main}20`
        }}
      >
        {rawEditableState !== RawEditableState.AlwaysFalse &&
          <div className="flex items-center">
            <div {...attributes} {...listeners} className="cursor-move mr-2 flex">
              <DragIndicatorIcon fontSize="small" style={{touchAction: 'none'}}/>
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
        }


        <div className="m-1">
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
        </div>
      </div>
    </div>
  );
}

export default SortableContent;