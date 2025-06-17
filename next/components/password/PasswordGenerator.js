import React, {useEffect, useState} from "react";
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
  Slider,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Numbers as NumbersIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {generatePassword} from "@/lib/password/PasswordLogic";

function PasswordGenerator({keyValue}) {
  const [name, setName] = useState('');
  const [no, setNo] = useState(0);
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const generateButton = document.getElementById('generate');
        setTimeout(() => generateButton.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGeneratePassword = () => {
    if (keyValue === 0) {
      setAlertMessage('Please set your Secret Key');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }
    const generatedPassword = generatePassword(keyValue, name, no, length);
    setPassword(generatedPassword);
    handleContentCopy(generatedPassword);
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
          Password Generator
        </Typography>

        {/* Name Input */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="site-name">Site Name</InputLabel>
          <OutlinedInput
            id="site-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon/>
              </InputAdornment>
            }
            label="Site Name"
          />
        </FormControl>

        {/* Number Input */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="number">Number</InputLabel>
          <OutlinedInput
            id="number"
            type="number"
            value={no}
            onChange={(e) => setNo(parseInt(e.target.value) || 0)}
            startAdornment={
              <InputAdornment position="start">
                <NumbersIcon/>
              </InputAdornment>
            }
            label="Number"
          />
        </FormControl>

        {/* Length Slider */}
        <Box className="w-full gap-y-2">
          <Typography>Password Length: {length}</Typography>
          <Slider
            value={length}
            onChange={(_, newValue) => setLength(typeof newValue === 'number' ? newValue : newValue[0])}
            min={8}
            max={32}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Generate Button */}
        <Button
          id="generate"
          fullWidth
          variant="contained"
          onClick={handleGeneratePassword}
          className="mt-4"
        >
          Generate Password
        </Button>

        {/* Password Display */}
        {password && (
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="generated-password">Generated Password</InputLabel>
            <OutlinedInput
              id="generated-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                  </IconButton>
                  <IconButton
                    onClick={() => handleContentCopy(password)}
                    edge="end"
                  >
                    <ContentCopyIcon/>
                  </IconButton>
                </InputAdornment>
              }
              label="Generated Password"
            />
          </FormControl>
        )}
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

export default PasswordGenerator;