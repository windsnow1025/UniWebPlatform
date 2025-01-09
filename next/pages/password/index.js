import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Alert, Button, CssBaseline, IconButton, Snackbar, Tooltip} from "@mui/material";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import {generatePassword} from "../../src/password/PasswordLogic";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import UserLogic from "../../src/common/user/UserLogic";

function PasswordGenerator() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Password Generator";
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const sendButton = document.getElementById('generate');
        setTimeout(() => sendButton.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [fetchedPin, setFetchedPin] = useState(0);
  const [newPin, setNewPin] = useState('');
  const [name, setName] = useState('');
  const [no, setNo] = useState(0);
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState();

  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const fetchPin = async () => {
    try {
      const pin = await userLogic.fetchPin();
      setFetchedPin(pin);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }

  useEffect(() => {
    fetchPin();
  }, []);

  const handleUpdatePin = async () => {
    try {
      await userLogic.updateUserPin(parseInt(newPin));
      fetchPin();
      setAlertMessage("Update success");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }

  const handleGeneratePassword = () => {
    let currentPin;
    if (newPin !== "") {
      currentPin = newPin;
    } else {
      currentPin = fetchedPin;
    }
    const password = generatePassword(currentPin, name, no, length);
    setPassword(password);
    navigator.clipboard.writeText(password);
  }

  const handleContentCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title="Password Generator"/>
        <div className="local-scroll-scrollable flex-center">
          <div className="text-center">
            <div className="m-2">
              {fetchedPin ? (
                <div>Pin Loaded</div>
              ) : (
                <div>Pin Loading</div>
              )}
            </div>
            <div className="m-2">
              <TextField
                label="Pin"
                variant="outlined"
                type="number"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="m-2">
              <Button variant="contained" onClick={handleUpdatePin}>Update Pin</Button>
            </div>
            <div className="m-2 mt-16">Password</div>
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
              <TextField
                label="No"
                variant="outlined"
                type="text"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="m-2">
              <TextField
                label="Length"
                variant="outlined"
                type="text"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="m-2">
              <Button id="generate" variant="contained" onClick={handleGeneratePassword}>Generate</Button>
            </div>
            <div className="m-2">
              {password &&
                <div className="flex-center">
                  <div>{password}</div>
                  <Tooltip title="Copy">
                    <IconButton aria-label="copy" onClick={handleContentCopy}>
                      <ContentCopyIcon fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                </div>
              }
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

export default PasswordGenerator;