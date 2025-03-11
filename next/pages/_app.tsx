import '../src/global.css';
import {ThemeProvider as MUIThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import {AppThemeProvider, useAppTheme} from "@/app/contexts/ThemeContext";

import {NextAppProvider} from '@toolpad/core/nextjs';
import {PageContainer} from '@toolpad/core/PageContainer';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import Head from 'next/head';
import {AppCacheProvider} from '@mui/material-nextjs/v14-pagesRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import type {Navigation} from '@toolpad/core/AppProvider';
import {AppProps} from "next/app";

import * as React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import ImageIcon from '@mui/icons-material/Image';
import PasswordIcon from '@mui/icons-material/Password';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
  },
  {
    segment: 'chat',
    title: 'AI Chat',
    icon: <ChatIcon />,
  },
  {
    segment: 'image',
    title: 'AI Image',
    icon: <ImageIcon />,
  },
  {
    segment: 'password',
    title: 'Password Generator',
    icon: <PasswordIcon />,
  },
  {
    segment: 'markdown',
    title: 'Blogs',
    icon: <EditNoteIcon />,
  },
  {
    segment: 'bookmark',
    title: 'Bookmarks',
    icon: <BookmarksIcon />,
  },
];

const BRANDING = {
  title: 'Windsnow1025',
};

function MUIToolpadApp({ Component }: { Component: React.ElementType }) {
  return (
    <AppCacheProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
        <DashboardLayout>
          <PageContainer>
            <Component />
          </PageContainer>
        </DashboardLayout>
      </NextAppProvider>
    </AppCacheProvider>
  );
}

function MUIThemedApp(props: AppProps) {
  const { muiTheme } = useAppTheme();

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <MUIToolpadApp {...props} />
    </MUIThemeProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <AppThemeProvider>
      <MUIThemedApp {...props} />
    </AppThemeProvider>
  );
}