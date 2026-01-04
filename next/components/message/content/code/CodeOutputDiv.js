import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextContent from "../text/TextContent";
import {RawEditableState} from "../../../../lib/common/message/EditableState";
import CollapsibleSection from "../../../common/CollapsibleSection";

function CodeOutputDiv({output, setOutput, isPreview, isLoading}) {
  if (!output) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const headerActions = (
    <>
      <Tooltip title="Copy Output">
        <IconButton size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
      {!isPreview && (
        <Tooltip title="Remove Output">
          <IconButton aria-label="remove-output" onClick={() => setOutput(null)}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const wrappedOutput = `\`\`\`\n${output}\n\`\`\``;

  return (
    <CollapsibleSection
      title="Code Output"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      <TextContent
        content={wrappedOutput}
        setContent={() => {
        }}
        rawEditableState={RawEditableState.AlwaysFalse}
      />
    </CollapsibleSection>
  );
}

export default CodeOutputDiv;
