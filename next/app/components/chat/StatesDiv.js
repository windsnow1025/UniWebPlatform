import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";

function StatesDiv({editableState, setEditableState, shouldSanitize, setShouldSanitize}) {
  return (
    <div className="flex-around">
      <div className="mx-1">
        <FormControl size="small" className="mt-2">
          <InputLabel id="editable-select-label">Editable</InputLabel>
          <Select
            labelId="editable-select-label"
            id="editable-select"
            value={editableState}
            label="Editable"
            onChange={e => setEditableState(e.target.value)}
          >
            <MenuItem value="role-based">Role-based</MenuItem>
            <MenuItem value="conditional">Conditional</MenuItem>
            <MenuItem value="always-true">Always True</MenuItem>
            <MenuItem value="always-false">Always False</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="mx-1">
        <FormControlLabel control={
          <Checkbox
            id="sanitize-check-box"
            checked={shouldSanitize}
            onChange={e => setShouldSanitize(e.target.checked)}/>
        } label="Sanitize"/>
      </div>
    </div>
  )
}

export default StatesDiv;