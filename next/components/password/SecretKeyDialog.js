import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {Key as KeyIcon, Visibility, VisibilityOff} from "@mui/icons-material";

function SecretKeyDialog({open, onClose, keyValue, setKeyValue}) {
  const [inputValue, setInputValue] = useState(keyValue);
  const [rememberKey, setRememberKey] = useState(true);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (open) setInputValue(keyValue);
  }, [open, keyValue]);

  const handleSave = () => {
    setKeyValue(inputValue, rememberKey);
    onClose();
  };

  const handleClickShowKey = () => {
    setShowKey(!showKey);
  };

  const handleMouseDownKey = (event) => {
    event.preventDefault();
  };

  const handleMouseUpKey = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Secret Key</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-secret-key">Secret Key</InputLabel>
          <OutlinedInput
            id="outlined-adornment-secret-key"
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showKey ? 'hide the secret key' : 'display the secret key'
                  }
                  onClick={handleClickShowKey}
                  onMouseDown={handleMouseDownKey}
                  onMouseUp={handleMouseUpKey}
                  edge="end"
                >
                  {showKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Secret Key"
            autoFocus
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              color="primary"
            />
          }
          label="Remember this key"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SecretKeyDialog;