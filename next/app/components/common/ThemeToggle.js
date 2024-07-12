import React from 'react';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import useScreenSize from "../../hooks/useScreenSize";

const ThemeToggle = ({systemTheme, setSystemTheme}) => {
  const screenSize = useScreenSize();
  const smallMediumIconSize = screenSize === 'xs' ? 'small' : 'medium';

  return (
    <ToggleButtonGroup
      value={systemTheme || 'system'}
      exclusive
      onChange={(event, newTheme) => setSystemTheme(newTheme)}
      size={smallMediumIconSize}
    >
      <ToggleButton value="system">
        <BrightnessAutoIcon
          fontSize={smallMediumIconSize}
          className="text-white"
        />
      </ToggleButton>
      <ToggleButton value="light">
        <LightModeIcon
          fontSize={smallMediumIconSize}
          className="text-white"
        />
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkModeIcon
          fontSize={smallMediumIconSize}
          className="text-white"
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;