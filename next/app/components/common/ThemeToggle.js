import React from 'react';
import {ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import useScreenSize from "../../hooks/useScreenSize";
import {ThemeType} from "../../utils/Theme";

const ThemeToggle = ({systemTheme, setSystemTheme}) => {
  const screenSize = useScreenSize();
  const smallMediumIconSize = screenSize === 'xs' || screenSize === 'sm' ? 'small' : 'medium';

  return (
    <ToggleButtonGroup
      value={systemTheme || 'system'}
      exclusive
      onChange={(event, newTheme) => setSystemTheme(newTheme)}
      size={smallMediumIconSize}
    >
      <Tooltip title="System">
        <ToggleButton value={ThemeType.System}>
          <BrightnessAutoIcon
            fontSize={smallMediumIconSize}
          />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Light">
        <ToggleButton value={ThemeType.Light}>
          <LightModeIcon
            fontSize={smallMediumIconSize}
          />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Dark">
        <ToggleButton value={ThemeType.Dark}>
          <DarkModeIcon
            fontSize={smallMediumIconSize}
          />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;