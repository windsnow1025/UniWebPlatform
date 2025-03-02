import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function DisplayDiv({ message, setMessage }) {
  if (!message.display) return null;

  return (
    <div className="flex">
      <div
        dangerouslySetInnerHTML={{ __html: message.display }}
        className="flex-1"
      />
      <Tooltip title="Remove Display" className="self-start">
        <IconButton
          aria-label="remove-display"
          onClick={() => setMessage({...message, display: null})}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default DisplayDiv;