import React from 'react';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';

const ThemeToggle = ({systemTheme, setSystemTheme}) => {
  return (
    <ToggleButtonGroup
      value={systemTheme || 'system'}
      exclusive
      onChange={(event, newTheme) => setSystemTheme(newTheme)}
      aria-label="Theme"
    >
      <ToggleButton value="system">
        <BrightnessAutoIcon
          fontSize="small"
          className="text-white"
        />
      </ToggleButton>
      <ToggleButton value="light">
        <LightModeIcon
          fontSize="small"
          className="text-white"
        />
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkModeIcon
          fontSize="small"
          className="text-white"
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;