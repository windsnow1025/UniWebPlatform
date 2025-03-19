import '../src/global.css';

import * as React from 'react';
import {NextAppProvider} from '@toolpad/core/nextjs';
import {PageContainer} from '@toolpad/core/PageContainer';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import Head from 'next/head';
import {AppCacheProvider} from '@mui/material-nextjs/v14-pagesRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
  type Session,
  type Navigation,
} from '@toolpad/core/AppProvider';

import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import ImageIcon from '@mui/icons-material/Image';
import PasswordIcon from '@mui/icons-material/Password';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

import UserLogic from "@/src/common/user/UserLogic";
import {useRouter} from "next/router";
import {usePathname} from "next/navigation";
import EmailVerificationDialog from "@/app/components/common/EmailVerificationDialog";
import AnnouncementSnackbar from "@/app/components/common/AnnouncementSnackbar";

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
    kind: 'divider',
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

export default function App({ Component }: { Component: React.ElementType }) {
  const [session, setSession] = React.useState<Session | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      const userLogic = new UserLogic();
      const user = await userLogic.fetchUser();
      if (!user) {
        return;
      }
      setSession({
        user: {
          name: user.username,
          email: user.email,
          image: user.avatar,
        }
      });
    };
    fetchUser();
  }, [router]);

  const pathname = usePathname();

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        router.push(`/auth/signin?redirect=${encodeURIComponent(pathname!)}`);
      },
      signOut: () => {
        setSession(null);
        localStorage.removeItem("token");
        router.push(`/auth/signin?redirect=${encodeURIComponent(pathname!)}`);
      },
    };
  }, []);

  return (
    <AppCacheProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NextAppProvider
        session={session}
        authentication={authentication}
        navigation={NAVIGATION}
        branding={BRANDING}
      >
        <EmailVerificationDialog/>
        <AnnouncementSnackbar/>
        <div className="local-scroll-root">
          <DashboardLayout>
          {/*<PageContainer>*/}
            <Component />
          {/*</PageContainer>*/}
          </DashboardLayout>
        </div>
      </NextAppProvider>
    </AppCacheProvider>
  );
}
