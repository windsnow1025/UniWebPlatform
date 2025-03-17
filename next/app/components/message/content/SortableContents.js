import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableContent from './SortableContent';

function SortableContents({ contents, setContents, shouldSanitize, rawEditableState, setUploadProgress }) {
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

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    setContents(arrayMove(contents, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={contents.map((_, index) => `content-${index}`)} strategy={verticalListSortingStrategy}>
        {contents.length === 0 ? (
          <div className="text-center text-gray-500 my-4">
            No content. Add text or files using the buttons below.
          </div>
        ) : (
          contents.map((content, index) => (
            <SortableContent
              key={`content-${index}`}
              id={`content-${index}`}
              content={content}
              onChange={(newData) => handleContentChange(index, newData)}
              onDelete={() => handleContentDelete(index)}
              shouldSanitize={shouldSanitize}
              rawEditableState={rawEditableState}
              setUploadProgress={setUploadProgress}
            />
          ))
        )}
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;