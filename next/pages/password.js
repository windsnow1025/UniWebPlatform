import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Button, CssBaseline, IconButton, Tooltip} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import {createMUITheme} from "../app/utils/Theme";
import UserService from "../src/service/UserService";
import {generatePassword} from "../src/logic/PasswordLogic";
import Snackbar from "@mui/material/Snackbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function Password() {
  const [systemTheme, setSystemTheme] = useState();
  const [muiTheme, setMuiTheme] = useState();

  useEffect(() => {
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

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

  const [pin, setPin] = useState(0);
  const [newPin, setNewPin] = useState('');
  const [name, setName] = useState('');
  const [no, setNo] = useState(0);
  const [password, setPassword] = useState();

  const userService = new UserService();

  const fetchPin = async () => {
    const pin = await userService.fetchPin();
    setPin(pin);
  }

  useEffect(() => {
    fetchPin();
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdatePin = async () => {
    try {
      await userService.updatePin(newPin);
      fetchPin();
      setAlertMessage("Update success");
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  }

  const handleGeneratePassword = () => {
    const password = generatePassword(pin, name, no);
    setPassword(password);
    navigator.clipboard.writeText(password);
  }

  const handleContentCopy = () => {
    navigator.clipboard.writeText(password);
  };

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
                {pin ? (
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
