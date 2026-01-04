import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextContent from "../text/TextContent";
import {RawEditableState} from "../../../../lib/common/message/EditableState";
import CollapsibleSection from "../../../common/CollapsibleSection";

function CodeDiv({code, setCode, isPreview, isLoading}) {
  if (!code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const headerActions = (
    <>
      <Tooltip title="Copy Code">
        <IconButton size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
      {!isPreview && (
        <Tooltip title="Remove Code">
          <IconButton aria-label="remove-code" onClick={() => setCode(null)}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const wrappedCode = `\`\`\`\n${code}\n\`\`\``;

  return (
    <CollapsibleSection
      title="Code"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      <TextContent
        content={wrappedCode}
        setContent={() => {
        }}
        rawEditableState={RawEditableState.AlwaysFalse}
      />
    </CollapsibleSection>
  );
}

export default CodeDiv;
