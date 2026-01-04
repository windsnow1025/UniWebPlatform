import React, {useState} from 'react';
import {Collapse, IconButton, Tooltip, Typography, useTheme, CircularProgress} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function CollapsibleSection({
                              title,
                              children,
                              headerActions,
                              isLoading,
                            }) {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  return (
    <div
      className="p-1 rounded-md my-2"
      style={{
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main}, transparent 90%)`
    }}
    >
      <div className="flex-center">
        <Typography variant="h6" className="pl-2">{title}</Typography>
        <div className="flex-1">
          {isLoading && (
            <CircularProgress size={14} thickness={6} className="ml-2"/>
          )}
        </div>

        <Tooltip title={collapsed ? "Expand" : "Collapse"}>
          <IconButton size="small" onClick={() => setCollapsed(prev => !prev)}>
            {collapsed ? <ExpandMoreIcon fontSize="small"/> : <ExpandLessIcon fontSize="small"/>}
          </IconButton>
        </Tooltip>

        {headerActions}
      </div>

      <Collapse in={!collapsed}>
        {children}
      </Collapse>
    </div>
  );
}

export default CollapsibleSection;
