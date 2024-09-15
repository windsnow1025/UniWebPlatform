import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";
import {EditableState} from "../../../../src/conversation/chat/Message";

function AdvancedStatesDiv({editableState, setEditableState, shouldSanitize, setShouldSanitize}) {
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
            <MenuItem value={EditableState.RoleBased}>Role-based</MenuItem>
            <MenuItem value={EditableState.InteractionBased}>Interaction-based</MenuItem>
            <MenuItem value={EditableState.AlwaysTrue}>Always True</MenuItem>
            <MenuItem value={EditableState.AlwaysFalse}>Always False</MenuItem>
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

export default AdvancedStatesDiv;