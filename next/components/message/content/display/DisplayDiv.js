import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function DisplayDiv({ display, setDisplay, isPreview }) {

  if (!display) return null;

  return (
    <div className="flex local-scroll-scrollable pb-1">
      <div
        dangerouslySetInnerHTML={{ __html: display }}
        className="flex-1 m-0.25"
      />
      <Tooltip title={isPreview ? "Disabled in Preview" : "Remove Display"} className="self-start">
        <span>
          <IconButton
            aria-label="remove-display"
            onClick={() => {setDisplay(null)}}
            disabled={isPreview}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
}

export default DisplayDiv;