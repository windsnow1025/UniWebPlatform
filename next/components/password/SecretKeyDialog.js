import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {Key as KeyIcon} from "@mui/icons-material";

function SecretKeyDialog({open, onClose, keyValue, setKeyValue}) {
  const [inputValue, setInputValue] = useState(keyValue);
  const [rememberKey, setRememberKey] = useState(true);

  useEffect(() => {
    if (open) setInputValue(keyValue);
  }, [open, keyValue]);

  const handleSave = () => {
    setKeyValue(inputValue, rememberKey);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Secret Key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Secret Key"
          type="number"
          fullWidth
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
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
