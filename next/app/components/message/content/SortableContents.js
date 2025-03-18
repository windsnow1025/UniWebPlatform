import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableContent from './SortableContent';
import {Typography} from "@mui/material";

function SortableContents({
                            contents,
                            setContents,
                            shouldSanitize,
                            rawEditableState,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleContentChange = (index, newData) => {
    const newContents = [...contents];
    newContents[index] = { ...newContents[index], data: newData };
    setContents(newContents);
  };

  const handleContentDelete = (index) => {
    const newContents = [...contents];
    newContents.splice(index, 1);
    setContents(newContents);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id, 10);
    const newIndex = parseInt(over.id, 10);

    setContents(arrayMove(contents, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={contents.map((_, index) => index.toString())}
        strategy={verticalListSortingStrategy}
      >
        {contents.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ my: 2 }}>
            No content. Add text or files using the buttons below.
          </Typography>
        ) : (
          contents.map((content, index) => (
            <SortableContent
              key={index}
              id={index.toString()}
              content={content}
              onChange={(newData) => handleContentChange(index, newData)}
              onDelete={() => handleContentDelete(index)}
              shouldSanitize={shouldSanitize}
              rawEditableState={rawEditableState}
            />
          ))
        )}
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;