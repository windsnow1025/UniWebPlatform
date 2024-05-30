import {Checkbox, FormControlLabel, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";

function ChatStates({editableState, setEditableState, shouldSanitize, setShouldSanitize}) {
  return (
    <div className="flex-around">
      <FormControl className="m-2">
        <InputLabel id="editable-select-label">Editable</InputLabel>
        <Select
          labelId="editable-select-label"
          id="editable-select"
          value={editableState}
          label="Editable"
          onChange={e => setEditableState(e.target.value)}
        >
          <MenuItem value="conditional">Conditional</MenuItem>
          <MenuItem value="always-true">Always True</MenuItem>
          <MenuItem value="always-false">Always False</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel control={
        <Checkbox id="sanitize-check-box" checked={shouldSanitize} onChange={e => setShouldSanitize(e.target.checked)}/>
      } label="Sanitize"/>
    </div>
  )
}

export default ChatStates;