import React, {useEffect} from 'react';
import { useRouter } from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Snackbar, Alert } from "@mui/material";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import {wait} from "../../../app/utils/Wait";

function SignIn() {
  const { muiTheme } = useThemeHandler();

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('info');

  const providers = [{ id: 'credentials', name: 'Email and Password' }];

  const handleSignIn = async (provider, formData) => {
    try {
      const email = formData.get('email');
      const password = formData.get('password');

      await userLogic.signIn(email, password);

      setAlertMessage("Signed in success. Redirecting...");
      setAlertSeverity('success');
      setAlertOpen(true);

      const prevUrl = localStorage.getItem('prevUrl') || "/";

      await wait(1);
      router.push(prevUrl);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar title={"Sign In"} useSignDiv={false} />
        <div className="local-scroll-scrollable">
          <AppProvider theme={muiTheme}>
            <SignInPage
              signIn={handleSignIn}
              providers={providers}
              slotProps={{
                emailField: { autoFocus: false },
              }}
            />
          </AppProvider>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignIn;