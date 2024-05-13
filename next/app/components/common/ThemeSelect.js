import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {applyTheme} from "../../utils/Theme";

const ThemeSelect = ({systemTheme, setSystemTheme}) => {
  const onSelectChange = (event) => {
    const systemTheme = event.target.value;
    localStorage.setItem("theme", systemTheme);
    applyTheme(systemTheme);
    setSystemTheme(systemTheme);
  }

  return (
    <div>
      <FormControl fullWidth className="mt-2">
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={systemTheme || 'system'}
          label="Theme"
          onChange={onSelectChange}
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