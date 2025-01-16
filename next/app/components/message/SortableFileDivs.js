import React from 'react';
import {DndContext, PointerSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter } from "@dnd-kit/core";
import SortableFileDiv from './SortableFileDiv';

const SortableFileDivs = ({ files, setFiles }) => {
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

  const detectSensor = () => {
    const isTouchDevice = () => {
      return window.matchMedia('(pointer: coarse)').matches;
    };
    return isTouchDevice ? PointerSensor : TouchSensor;
  }

  const sensors = useSensors(
    useSensor(detectSensor(), {
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
      <SortableContext items={files} strategy={rectSortingStrategy}>
        <div className="flex-start-start">
          {files.map((file) => (
            <SortableFileDiv
              key={file}
              fileUrl={file}
              files={files}
              setFiles={setFiles}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableFileDivs;