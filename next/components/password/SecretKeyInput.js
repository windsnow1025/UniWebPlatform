import React from "react";
import {FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton} from "@mui/material";
import {Key as KeyIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from "@mui/icons-material";

function SecretKeyInput({keyValue, setKeyValue, showKey, setShowKey}) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="secret-key">Secret Key</InputLabel>
      <OutlinedInput
        id="secret-key"
        type={showKey ? 'number' : 'password'}
        value={keyValue ?? ''}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setKeyValue(0);
          } else {
            setKeyValue(parseInt(value) || 0);
          }
        }}
        startAdornment={
          <InputAdornment position="start">
            <KeyIcon/>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowKey(!showKey)} edge="end">
              {showKey ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </IconButton>
          </InputAdornment>
        }
        label="Secret Key"
      />
    </FormControl>
  );
}

export default SecretKeyInput;