import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Button, IconButton, lighten, LinearProgress, Tooltip } from "@mui/material";
import RoleDiv from './role/RoleDiv';
import RoleSelect from './role/RoleSelect';
import ContentItem from './content/ContentItem';
import DisplayDiv from "./content/DisplayDiv";
import { MessageRoleEnum, ContentTypeEnum } from "../../../client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import {RoleEditableState} from "../../../src/conversation/chat/Message";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      roleEditableState = RoleEditableState.RoleBased,
                    }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleRoleChange = (newRole) => {
    setMessage({
      ...message,
      role: newRole
    });
  };

  const handleContentChange = (index, newData) => {
    const newContents = [...message.contents];
    newContents[index] = {
      ...newContents[index],
      data: newData
    };

    setMessage({
      ...message,
      contents: newContents
    });
  };

  const handleContentDelete = (index) => {
    const newContents = [...message.contents];
    newContents.splice(index, 1);

    setMessage({
      ...message,
      contents: newContents
    });
  };

  const handleAddContent = (type) => {
    const newContents = [...message.contents];
    const newContent = {
      type,
      data: ''
    };

    newContents.push(newContent);

    setMessage({
      ...message,
      contents: newContents
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('-')[1]);
      const newIndex = parseInt(over.id.split('-')[1]);

      setMessage({
        ...message,
        contents: arrayMove(message.contents, oldIndex, newIndex)
      });
    }
  };

  const getRoleBorderStyles = (role) => {
    switch (role) {
      case MessageRoleEnum.User:
        return {border: `1px solid ${lighten(theme.palette.primary.main, 0.5)}`};
      case MessageRoleEnum.Assistant:
        return {border: `1px solid ${lighten(theme.palette.secondary.main, 0.5)}`};
      case MessageRoleEnum.System:
        return {border: `1px solid ${lighten(theme.palette.warning.main, 0.5)}`};
      default:
        return {};
    }
  };

  const getMessageContainerStyles = (role) => {
    switch (role) {
      case MessageRoleEnum.User:
        return {justifyContent: 'flex-end'};
      case MessageRoleEnum.Assistant:
        return {justifyContent: 'flex-start'};
      case MessageRoleEnum.System:
        return {justifyContent: 'center'};
      default:
        return {};
    }
  };

  // Generate sortable IDs for each content item
  const sortableIds = message.contents.map((_, index) => `content-${index}`);

  return (
    <div style={{
      ...getMessageContainerStyles(message.role),
      display: 'flex',
    }}>
      <div
        className="px-2 py-3 rounded-lg"
        style={{
          ...getRoleBorderStyles(message.role),
          minWidth: "75%",
          maxWidth: "95%",
        }}
      >
        <div className="flex">
          {useRoleSelect ? (
            <RoleSelect role={message.role} setRole={handleRoleChange}/>
          ) : (
            <RoleDiv role={message.role} setRole={handleRoleChange}/>
          )}
          <div className="inflex-fill"></div>
          {onMessageDelete && (
            <Tooltip title="Delete Message">
              <IconButton aria-label="delete" onClick={onMessageDelete}>
                <RemoveCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* Content items */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {message.contents.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                No content. Add text or files using the buttons below.
              </div>
            ) : (
              message.contents.map((content, index) => (
                <ContentItem
                  key={`content-${index}`}
                  id={`content-${index}`}
                  content={content}
                  onChange={(newData) => handleContentChange(index, newData)}
                  onDelete={() => handleContentDelete(index)}
                  shouldSanitize={shouldSanitize}
                  rawEditableState={roleEditableState}
                  setUploadProgress={setUploadProgress}
                />
              ))
            )}
          </SortableContext>
        </DndContext>

        {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress * 100}/>}

        {/* Display div in the middle */}
        <DisplayDiv message={message} setMessage={setMessage}/>

        {/* Add content buttons at the bottom */}
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
      </div>
    </div>
  );
}

export default MessageDiv;