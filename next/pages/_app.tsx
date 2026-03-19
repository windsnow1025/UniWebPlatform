import '../lib/global.css';

import * as React from 'react';
import Head from 'next/head';
import {AppCacheProvider} from '@mui/material-nextjs/v14-pagesRouter';
import {createTheme, ThemeProvider} from "@mui/material/styles";

import {useRouter} from "next/router";
import {usePathname} from "next/navigation";
import UserLogic from "@/lib/common/user/UserLogic";
import {StorageKeys} from "@/lib/common/Constants";
import {type Session, SessionProvider} from "@/components/common/session/SessionContext";
import Dashboard from "@/components/common/dashboard/Dashboard";
import EmailVerificationDialog from "@/components/common/components/EmailVerificationDialog";

const muiTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  colorSchemes: {light: true, dark: true},
});

export default function App({Component}: { Component: React.ElementType }) {
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
        localStorage.removeItem(StorageKeys.Token);
        router.push(`/auth/signin?redirect=${encodeURIComponent(pathname!)}`);
      },
    };
  }, [pathname, router]);

  return (
    <AppCacheProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </Head>
      <ThemeProvider theme={muiTheme}>
        <SessionProvider session={session} authentication={authentication}>
          <EmailVerificationDialog/>
          <div className="local-scroll-root">
            <Dashboard>
              <Component/>
            </Dashboard>
          </div>
        </SessionProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
