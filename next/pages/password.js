import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Button, CssBaseline} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import {createMUITheme} from "../app/utils/Theme";
import UserService from "../src/service/UserService";
import Snackbar from "@mui/material/Snackbar";

function Password() {
  const [systemTheme, setSystemTheme] = useState();
  const [muiTheme, setMuiTheme] = useState();

  useEffect(() => {
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

  useEffect(() => {
    document.title = "Password Generator";
  }, []);

  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const userService = new UserService();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdatePin = async () => {
    try {
      await userService.updatePin(pin);
      setAlertMessage("Update success");
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  }

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme/>
          <HeaderAppBar
            title="Password Generator"
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="flex-center">
            <div className="text-center">
              <div className="m-2">
                <TextField
                  label="Pin"
                  variant="outlined"
                  type="number"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="m-2">
                <Button variant="contained" onClick={handleUpdatePin}>Update Pin</Button>
              </div>
              <div className="m-2">
                {password}
              </div>
            </div>
          </div>
          <div className="flex-center">
            <div className="text-center">
              <div className="m-2">
                <TextField
                  label="Name"
                  variant="outlined"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="m-2">
                <Button variant="contained" onClick={() => {
                }}>Generate</Button>
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
      }
    </>
  );
}

export default Password;
