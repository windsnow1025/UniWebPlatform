import React, { useState } from 'react';
import { IconButton, Tooltip, Typography, useTheme, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextContent from "../text/TextContent";
import {RawEditableState} from "../../../../lib/common/message/EditableState";

function ThoughtDiv({ thought, setThought, isPreview, hasText }) {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  if (!thought) return null;

  return (
    <div
      className="p-1 rounded-md my-2"
      style={{
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main}, transparent 90%)`
      }}
    >
      <div className="flex-center">
        <Typography variant="h6" className="pl-1">Thought</Typography>
        <div className="flex-1">
          {!hasText && (
            <CircularProgress size={14} thickness={6} className="ml-2" />
          )}
        </div>
        <Tooltip title={collapsed ? "Expand Thought" : "Collapse Thought"}>
          <IconButton size="small" onClick={() => setCollapsed(prev => !prev)}>
            {collapsed ? <ExpandMoreIcon fontSize="small"/> : <ExpandLessIcon fontSize="small"/>}
          </IconButton>
        </Tooltip>
        <Tooltip title={isPreview ? "Disabled in Preview" : "Remove Thought"} className="self-start">
          <span>
            <IconButton aria-label="remove-thought" onClick={() => {setThought(null)}} disabled={isPreview}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      {!collapsed && (
        <TextContent
          content={thought}
          setContent={() => {}}
          rawEditableState={RawEditableState.AlwaysFalse}
        />
      )}
    </div>
  );
}

export default ThoughtDiv;
