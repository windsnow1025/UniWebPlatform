import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";
import {RoleEditableState} from "../../../src/common/message/EditableState";

function StatesDiv({
                     roleEditableState,
                     setRoleEditableState,
                     shouldSanitize,
                     setShouldSanitize
}) {
  return (
    <div className="flex-around">
      <div className="mx-1">
        <FormControl size="small" className="mt-2">
          <InputLabel id="editable-select-label">Editable</InputLabel>
          <Select
            labelId="editable-select-label"
            id="editable-select"
            value={roleEditableState}
            label="Editable"
            variant="outlined"
            onChange={e => setRoleEditableState(e.target.value)}
          >
            <MenuItem value={RoleEditableState.RoleBased}>Role-based</MenuItem>
            <MenuItem value={RoleEditableState.InteractionBased}>Interaction-based</MenuItem>
            <MenuItem value={RoleEditableState.AlwaysTrue}>Always True</MenuItem>
            <MenuItem value={RoleEditableState.AlwaysFalse}>Always False</MenuItem>
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