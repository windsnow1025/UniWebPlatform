import React, {useEffect, useState} from 'react';
import UserLogic from "../../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Alert, Button, CssBaseline, Snackbar} from "@mui/material";
import HeaderAppBar from "../HeaderAppBar";
import useThemeHandler from "../../../hooks/useThemeHandler";

function AccountCenter() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleUpdate = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      setAlertMessage("Username or Password contains invalid characters or has an invalid length.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      await userLogic.updateUserCredentials(username, password);
      setAlertMessage("Update success");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="flex-start-center">
        <div className="text-center">
          <div className="my-2">
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="my-2">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="my-2">
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
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
    </>
  );
}

export default AccountCenter;