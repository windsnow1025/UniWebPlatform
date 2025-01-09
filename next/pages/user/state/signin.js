import React, {useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Alert, Button, CssBaseline, Snackbar} from "@mui/material";
import TextField from "@mui/material/TextField";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function SignIn() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleSignIn = async () => {
    try {
      await userLogic.signIn(username, password)
      const prevUrl = localStorage.getItem('prevUrl') || "/";
      router.push(prevUrl);
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
                label="Username"
                variant="outlined"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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