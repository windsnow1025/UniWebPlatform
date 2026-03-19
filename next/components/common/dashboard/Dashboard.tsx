import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';

export default function Dashboard({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        height: '100vh',
        width: '100vw',
      }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0
        }}>
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 1,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
          </Stack>
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
}
