import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TextContent from "../text/TextContent";
import {RawEditableState} from "../../../../lib/common/message/EditableState";
import CollapsibleSection from "../../../common/CollapsibleSection";

function ThoughtDiv({thought, setThought, isPreview, isLoading}) {
  if (!thought) return null;

  const headerActions = !isPreview && (
    <Tooltip title="Remove Thought">
      <IconButton aria-label="remove-thought" onClick={() => setThought(null)}>
        <CloseIcon fontSize="small"/>
      </IconButton>
    </Tooltip>
  );

  return (
    <CollapsibleSection
      title="Thought"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      <TextContent
        content={thought}
        setContent={() => {
        }}
        rawEditableState={RawEditableState.AlwaysFalse}
      />
    </CollapsibleSection>
  );
}

export default ThoughtDiv;
