import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ToggleDrawerButton = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <Tooltip title="Conversations">
      <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDrawerButton;