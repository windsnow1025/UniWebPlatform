import React, {useState, useEffect} from 'react';
import {applyTheme} from '../logic/ThemeLogic.js';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const ThemeSelect = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    setTheme(theme);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="theme-select-label">Theme</InputLabel>
      <Select
        labelId="theme-select-label"
        id="theme-select"
        value={theme}
        label="Theme"
        onChange={handleThemeChange}
      >
        <MenuItem value="system">System</MenuItem>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ThemeSelect;