import {Checkbox, FormControlLabel} from "@mui/material";
import React from "react";

function ChatStates({ editable, setEditable, sanitize, setSanitize }) {
  return (
    <div>
      <FormControlLabel control={
        <Checkbox id="editable-check-box" checked={editable} onChange={e => setEditable(e.target.checked)}/>
      } label="Editable"/>
      <FormControlLabel control={
        <Checkbox id="sanitize-check-box" checked={sanitize} onChange={e => setSanitize(e.target.checked)}/>
      } label="Sanitize"/>
    </div>

  )
}

export default ChatStates;