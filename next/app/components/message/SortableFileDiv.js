import React from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FileDiv from './FileDiv';

const SortableFileDiv = ({ fileUrl, files, setFiles }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: fileUrl });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'grab',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FileDiv fileUrl={fileUrl} files={files} setFiles={setFiles} />
    </div>
  );
};

export default SortableFileDiv;