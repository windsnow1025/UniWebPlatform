import React from 'react';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import SortableFile from './SortableFile';

const SortableFiles = ({ files, setFiles, rawEditableState }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = files.indexOf(active.id);
      const newIndex = files.indexOf(over.id);
      const newFiles = [...files];
      newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, active.id);
      setFiles(newFiles);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files}
        strategy={rectSortingStrategy}
      >
        <div className="flex-start-start">
          {files.map((file) => (
            <SortableFile
              key={file}
              fileUrl={file}
              files={files}
              setFiles={setFiles}
              rawEditableState={rawEditableState}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableFiles;