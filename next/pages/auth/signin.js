import React, {useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../lib/common/user/UserLogic";
import {Alert, Link, Snackbar, Tab, Tabs, TextField, useTheme} from "@mui/material";
import {SignInPage} from '@toolpad/core/SignInPage';
import {wait} from "../../components/common/utils/Wait";
import Head from "next/head";

function SignUpLink() {
  return (
    <Link href="/auth/signup" variant="body2">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/auth/password-reset" variant="body2">
      Forgot password?
    </Link>
  );
}

function SignIn() {
  const userLogic = new UserLogic();
  const router = useRouter();

  const [tabValue, setTabValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

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

      setAlertMessage("Sign in success. Redirecting...");
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirect
      let redirectUrl = router.query.redirect;
      if (!redirectUrl || !redirectUrl.startsWith('/')) {
        redirectUrl = '/';
      }
      if (!(await userLogic.fetchEmailVerified())) {
        redirectUrl = '/settings';
      }
      await wait(1);
      router.push(redirectUrl);
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
    <div className="local-scroll-container">
      <Head>
        <title>Sign In - Windsnow1025</title>
      </Head>
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
            slots={{
              signUpLink: SignUpLink,
              forgotPasswordLink: ForgotPasswordLink,
            }}
            slotProps={{
              emailField: {autoFocus: false},
            }}
          />
        ) : (
          <SignInPage
            signIn={handleSignIn}
            providers={providers}
            slots={{
              emailField: UsernameField,
              signUpLink: SignUpLink,
              forgotPasswordLink: ForgotPasswordLink,
            }}
          />
        )}
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
    </div>
  );
}

export default SignIn;