import React from 'react';
import {IconButton, Tooltip, Typography, useTheme} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import TextContent from "./text/TextContent";
import {RawEditableState} from "../../../lib/common/message/EditableState";
import {ContentTypeEnum} from '@/client';
import FileDiv from "./file/FileDiv";

function SortableContent({
                           id,
                           index,
                           content,
                           onChange,
                           onDelete,
                           rawEditableState,
                           setConversationUpdateKey,
                           isTemporaryChat,
                           contents,
                           setContents,
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
    if (content.type === ContentTypeEnum.Text) {
      navigator.clipboard.writeText(content.data);
    }
  };

  const handleSetFiles = (newFileUrls) => {
    const newContents = contents.filter(c => {
      if (c.type !== ContentTypeEnum.File) return true;
      return newFileUrls.includes(c.data);
    });
    setContents(newContents);
    if (setConversationUpdateKey) {
      setConversationUpdateKey(prev => prev + 1);
    }
  };

  const theme = useTheme();
  const isTextContent = content.type === ContentTypeEnum.Text;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {isTextContent ? (
        <div
          className="p-1 rounded-md my-2"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main}, transparent 90%)`
          }}
        >
          {rawEditableState !== RawEditableState.AlwaysFalse && !isTemporaryChat && (
            <div className="flex items-center">
              <div
                {...listeners}
                className="cursor-move mr-2 flex"
                style={{touchAction: 'none'}}
              >
                <DragIndicatorIcon fontSize="small"/>
              </div>
              <Typography variant="subtitle2" className="flex-grow">
                Text Content
              </Typography>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={handleCopy}>
                  <ContentCopyIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={onDelete} color="error">
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </div>
          )}
          <TextContent
            content={content.data}
            setContent={onChange}
            rawEditableState={rawEditableState}
            setConversationUpdateKey={setConversationUpdateKey}
          />
        </div>
      ) : (
        <div className="flex items-center my-2">
          {rawEditableState !== RawEditableState.AlwaysFalse && !isTemporaryChat && (
            <div
              {...listeners}
              className="cursor-move mr-2 flex"
              style={{touchAction: 'none'}}
            >
              <DragIndicatorIcon fontSize="small"/>
            </div>
          )}
          <FileDiv
            fileUrl={content.data}
            files={contents.filter(c => c.type === ContentTypeEnum.File).map(c => c.data)}
            setFiles={handleSetFiles}
            rawEditableState={rawEditableState}
          />
        </div>
      )}
    </div>
  );
}

export default SortableContent;