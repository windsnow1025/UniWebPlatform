import React from 'react';
import {IconButton, Tooltip} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ToggleDrawerButton = ({drawerOpen, setDrawerOpen}) => {
  return (
    <div className="m-2">
      <Tooltip title="Conversations">
        <IconButton 
          id="toggle-conversation-button"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ToggleDrawerButton;
