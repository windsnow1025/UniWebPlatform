import React, {useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {applyTheme} from "@/app/utils/Theme";

interface ThemeSelectProps {
  systemTheme: string | undefined;
  setSystemTheme: (theme: string) => void;
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({systemTheme, setSystemTheme}) => {
  const onSelectChange = (event: SelectChangeEvent) => {
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