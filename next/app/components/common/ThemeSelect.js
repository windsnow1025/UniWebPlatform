import React, {useEffect, useState} from 'react';
import {applyTheme} from '../../../src/logic/ThemeLogic.js';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const ThemeSelect = () => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (theme && theme !== 'null') {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'system');
  }, []);


  const handleThemeChange = (event) => {
    const theme = event.target.value;
      setTheme(theme);
  };

  return (
    <div>
      <FormControl fullWidth className="mt-2">
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={theme || 'system'}
          label="Theme"
          onChange={handleThemeChange}
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