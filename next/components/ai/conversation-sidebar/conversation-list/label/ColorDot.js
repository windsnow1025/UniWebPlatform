import React from 'react';
import {Box} from '@mui/material';

export default function ColorDot({color, size = 12, sx = {}}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: color,
        ...sx,
      }}
    />
  );
}
