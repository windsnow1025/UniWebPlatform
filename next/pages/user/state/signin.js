import React, {useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Alert, Button, CssBaseline, Snackbar} from "@mui/material";
import TextField from "@mui/material/TextField";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function SignIn() {
  const {muiTheme} = useThemeHandler();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleSignIn = async () => {
    try {
      await userLogic.signIn(email, password);

      setAlertMessage("Signed in success");
      setAlertSeverity('success');
      setAlertOpen(true);

      const prevUrl = localStorage.getItem('prevUrl') || "/";
      setTimeout(() => {
        router.push(prevUrl);
      }, 2000);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title={"Sign In"} useSignDiv={false}/>
        <div className="local-scroll-scrollable flex-center">
          <div className="text-center">
            <div className="m-2">
              <TextField
                label="Email"
                variant="outlined"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="m-2">
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="m-2">
              <Button variant="contained" onClick={handleSignIn}>Sign In</Button>
            </div>
          </div>
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