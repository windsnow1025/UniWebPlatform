import React, {useState} from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import {
  ContentCopy as ContentCopyIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {encryptAES, decryptAES} from "../../lib/password/EncryptionLogic";

function EncryptorDecryptor({keyValue, setKeyValue}) {
  const [showKey, setShowKey] = useState(false);
  const [tabValue, setTabValue] = useState('0');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  const handleKeyChange = (e) => {
    const newKey = parseInt(e.target.value);
    setKeyValue(newKey);
  };

  const handleEncrypt = () => {
    if (keyValue === 0) {
      setAlertMessage('Please set your Secret Key');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    const encrypted = encryptAES(plaintext, keyValue);
    if (!encrypted) {
      setAlertMessage('Encryption failed');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    setCiphertext(encrypted);
    handleContentCopy(encrypted);
  };

  const handleDecrypt = () => {
    if (keyValue === 0) {
      setAlertMessage('Please set your Secret Key');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      const decrypted = decryptAES(textToDecrypt, keyValue);
      if (!decrypted) {
        throw new Error('Decryption failed');
      }
      setDecryptedText(decrypted);
      handleContentCopy(decrypted);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
  };

  const handleContentCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setAlertMessage('Text copied to clipboard');
        setAlertSeverity('success');
        setAlertOpen(true);
      })
      .catch((err) => {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      });
  };

  return (
    <div className="flex-center p-4">
      <Paper elevation={3} className="flex-center p-6 max-w-md gap-y-4">
        <Typography variant="h5" className="text-center" gutterBottom>
          AES Encryption / Decryption
        </Typography>

        {/* Secret Key Input */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="aes-secret-key">Secret Key</InputLabel>
          <OutlinedInput
            id="aes-secret-key"
            type={showKey ? 'number' : 'password'}
            value={keyValue ?? ''}
            onChange={handleKeyChange}
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon/>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowKey(!showKey)}
                  edge="end"
                >
                  {showKey ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                </IconButton>
              </InputAdornment>
            }
            label="Secret Key"
          />
        </FormControl>

        <Box sx={{width: '100%'}}>
          <TabContext value={tabValue}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="AES operations">
                <Tab label="Encrypt" value="0"/>
                <Tab label="Decrypt" value="1"/>
              </Tabs>
            </Box>

            {/* Encrypt Tab */}
            <TabPanel value="0">
              <TextField
                fullWidth
                label="Text to Encrypt"
                multiline
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                variant="outlined"
                margin="normal"
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<LockIcon/>}
                onClick={handleEncrypt}
                className="mt-4"
              >
                Encrypt
              </Button>

              {ciphertext && (
                <Box className="mt-4">
                  <Typography variant="subtitle1">Encrypted Text:</Typography>
                  <FormControl fullWidth variant="outlined">
                    <OutlinedInput
                      multiline
                      rows={3}
                      value={ciphertext}
                      readOnly
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleContentCopy(ciphertext)}
                            edge="end"
                          >
                            <ContentCopyIcon/>
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              )}
            </TabPanel>

            {/* Decrypt Tab */}
            <TabPanel value="1">
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="text-to-decrypt">Text to Decrypt</InputLabel>
                <OutlinedInput
                  id="text-to-decrypt"
                  type='text'
                  multiline
                  rows={3}
                  value={textToDecrypt}
                  onChange={(e) => setTextToDecrypt(e.target.value)}
                  label="Text to Decrypt"
                />
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                startIcon={<LockOpenIcon/>}
                onClick={handleDecrypt}
                className="mt-4"
              >
                Decrypt
              </Button>

              {decryptedText && (
                <Box className="mt-4">
                  <Typography variant="subtitle1">Decrypted Text:</Typography>
                  <FormControl fullWidth variant="outlined">
                    <OutlinedInput
                      multiline
                      value={decryptedText}
                      readOnly
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleContentCopy(decryptedText)}
                            edge="end"
                          >
                            <ContentCopyIcon/>
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>

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

export default EncryptorDecryptor;