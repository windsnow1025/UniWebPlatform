import React from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import FileDiv from './FileDiv';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useTheme} from "@mui/material";
import {RawEditableState} from "../../../../../lib/common/message/EditableState";

const SortableFile = ({ fileUrl, files, setFiles, rawEditableState }) => {
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

  const showDragHandle = rawEditableState !== RawEditableState.AlwaysFalse;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex-center-nowrap">
        {showDragHandle && (
          <div
            {...listeners}
            style={{cursor: 'grab', color: theme.palette.text.secondary, touchAction: 'none'}}
          >
            <DragIndicatorIcon fontSize="small"/>
          </div>
        )}
        <FileDiv
          fileUrl={fileUrl}
          files={files}
          setFiles={setFiles}
          rawEditableState={rawEditableState}
        />
      </div>
    </div>
  );
};

export default SortableFile;