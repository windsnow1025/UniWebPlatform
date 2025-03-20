import React from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import FileDiv from './FileDiv';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useTheme} from "@mui/material";

const SortableFile = ({fileUrl, files, setFiles}) => {
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
  };

  const theme = useTheme();

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex-center-nowrap">
        <div {...attributes} {...listeners} style={{cursor: 'grab', color: theme.palette.text.secondary}}>
          <DragIndicatorIcon fontSize="small" style={{touchAction: 'none',}}/>
        </div>
        <FileDiv fileUrl={fileUrl} files={files} setFiles={setFiles}/>
      </div>
    </div>
  );
};

export default SortableFile;