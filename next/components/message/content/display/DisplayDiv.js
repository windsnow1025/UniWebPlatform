import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function DisplayDiv({ display, setDisplay }) {

  if (!display) return null;

  return (
    <div className="flex local-scroll-scrollable">
      <div
        dangerouslySetInnerHTML={{ __html: display }}
        className="flex-1 m-0.25"
      />
      <Tooltip title="Remove Display" className="self-start">
        <IconButton
          aria-label="remove-display"
          onClick={() => setDisplay(null)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default DisplayDiv;