import React from 'react';
import {Box} from '@mui/material';
import {PRESET_COLORS} from './PresetColors';

export default function ColorPicker({color, setColor, size = 24, stopPropagation = false}) {
  return (
    <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center'}}>
      {PRESET_COLORS.slice(1).map((presetColor, idx) => (
        <Box
          key={idx}
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            setColor(presetColor);
          }}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            bgcolor: presetColor,
            cursor: 'pointer',
            border: color === presetColor ? '2px solid white' : 'none',
            boxShadow: color === presetColor
              ? (theme) => `0 0 0 2px ${theme.palette.primary.main}`
              : 'none',
          }}
        />
      ))}
    </Box>
  );
}
