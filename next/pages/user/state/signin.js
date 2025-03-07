import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Alert, CssBaseline, Snackbar, Tab, Tabs, TextField, useTheme} from "@mui/material";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import {SignInPage} from '@toolpad/core/SignInPage';
import {wait} from "../../../app/utils/Wait";

function SignIn() {
  const {muiTheme} = useThemeHandler();
  const router = useRouter();
  const userLogic = new UserLogic();

  const [tabValue, setTabValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const providers = [{id: 'credentials', name: 'Credentials'}];

  const handleSignIn = async (provider, formData) => {
    try {
      if (tabValue === 0) {
        // Email sign in
        const email = formData.get('email');
        const password = formData.get('password');
        await userLogic.signInByEmail(email, password);
      } else {
        // Username sign in
        const username = formData.get('username') || formData.get('email');
        const password = formData.get('password');
        await userLogic.signInByUsername(username, password);
      }

      setAlertMessage("Signed in successfully. Redirecting...");
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

  const UsernameField = (props) => {
    // See SignInPage.js - getCommonTextFieldProps
    const theme = useTheme();

    return (
      <TextField
        required
        fullWidth
        id="username"
        name="username"
        label="Username"
        placeholder="Enter your username"
        autoComplete="username"
        sx={{
          mt: theme.spacing(1),
          mb: theme.spacing(1)
        }}
        slotProps={{
          htmlInput: {
            sx: {
              paddingTop: theme.spacing(1),
              paddingBottom: theme.spacing(1)
            }
          },
          inputLabel: {
            sx: {
              lineHeight: theme.typography.pxToRem(12),
              fontSize: theme.typography.pxToRem(14)
            }
          }
        }}
        {...props}
      />
    );
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <div className="local-scroll-scrollable">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{borderBottom: 1, borderColor: 'divider'}}
          >
            <Tab label="Sign in with Email"/>
            <Tab label="Sign in with Username"/>
          </Tabs>

          {tabValue === 0 ? (
            <SignInPage
              signIn={handleSignIn}
              providers={providers}
              slotProps={{
                emailField: {autoFocus: false},
              }}
            />
          ) : (
            <SignInPage
              signIn={handleSignIn}
              providers={providers}
              slots={{
                emailField: UsernameField
              }}
            />
          )}
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignIn;