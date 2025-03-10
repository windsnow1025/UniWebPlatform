import React from 'react';
import {ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import useScreenSize from "../../hooks/useScreenSize";
import {ThemeType} from "../../utils/Theme";
import {useAppTheme} from "../../contexts/ThemeContext";

const ThemeToggle = () => {
  const screenSize = useScreenSize();
  const smallMediumIconSize = screenSize === 'xs' || screenSize === 'sm' ? 'small' : 'medium';

  const { theme, setTheme } = useAppTheme();

  return (
    <ToggleButtonGroup
      value={theme || 'system'}
      exclusive
      onChange={(event, newTheme) => setTheme(newTheme)}
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