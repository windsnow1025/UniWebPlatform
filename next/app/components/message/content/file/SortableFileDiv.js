import React from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import FileDiv from './FileDiv';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const SortableFileDiv = ({fileUrl, files, setFiles}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: fileUrl});

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex-center">
        <div {...attributes} {...listeners} style={{cursor: 'grab'}}>
          <DragIndicatorIcon/>
        </div>
        <FileDiv fileUrl={fileUrl} files={files} setFiles={setFiles}/>
      </div>
    </div>
  );
};

export default SortableFileDiv;