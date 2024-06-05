import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const ThemeSelect = ({systemTheme, setSystemTheme}) => {
  return (
    <div>
      <FormControl fullWidth className="mt-2">
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={systemTheme || 'system'}
          label="Theme"
          onChange={e => setSystemTheme(e.target.value)}
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ThemeSelect;