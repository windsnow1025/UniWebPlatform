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
                           contents,
                           setContents,
                           rawEditableState,
                           setConversationUpdateKey,
                           isTemporaryChat,
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

  const handleContentUpdate = (newValue) => {
    const newContents = [...contents];
    newContents[index] = {...newContents[index], data: newValue};
    setContents(newContents);
    setConversationUpdateKey(prev => prev + 1);
  };

  const handleContentDelete = () => {
    const newContents = [...contents];
    newContents.splice(index, 1);
    setContents(newContents);
    setConversationUpdateKey(prev => prev + 1);
  };

  const handleCopy = () => {
    if (content.type === ContentTypeEnum.Text) {
      navigator.clipboard.writeText(content.data);
    }
  };

  const theme = useTheme();
  const isTextContent = content.type === ContentTypeEnum.Text;

  if (isTextContent) {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <div
          className="p-1 rounded-md my-2"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main}, transparent 90%)`
          }}
        >
          {rawEditableState !== RawEditableState.AlwaysFalse && !isTemporaryChat && (
            <div className="flex-start-center">
              <div
                {...listeners}
                className="mr-2 flex"
                style={{cursor: 'grab', touchAction: 'none'}}
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
                <IconButton size="small" onClick={handleContentDelete} color="error">
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </div>
          )}
          <TextContent
            content={content.data}
            setContent={handleContentUpdate}
            rawEditableState={rawEditableState}
            setConversationUpdateKey={setConversationUpdateKey}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <div className="flex-start-center">
          {rawEditableState !== RawEditableState.AlwaysFalse && !isTemporaryChat && (
            <div
              {...listeners}
              className="flex"
              style={{cursor: 'grab', touchAction: 'none'}}
            >
              <DragIndicatorIcon fontSize="small"/>
            </div>
          )}
          <FileDiv
            fileUrl={content.data}
            rawEditableState={rawEditableState}
            onDelete={handleContentDelete}
          />
        </div>
      </div>
    );
  }

}

export default SortableContent;