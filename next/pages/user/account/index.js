import React, {useEffect, useState} from 'react';
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Button, CssBaseline} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "Account Center";
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdate = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      setAlertMessage("Username or Password contains invalid characters or has an invalid length.");
      setAlertOpen(true);
      return;
    }

    try {
      await userLogic.updateUser(username, password);
      setAlertMessage("Update success");
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="User Center"
          useAuthDiv={false}
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
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
              <Button variant="contained" onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </ThemeProvider>
  );
}

export default Index;
