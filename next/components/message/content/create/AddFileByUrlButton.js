import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function AddFileByUrlButton({ setUrl, disabled }) {
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const handleAdd = () => {
    if (inputUrl.trim()) {
      setUrl(inputUrl.trim());
      setInputUrl('');
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ mr: 1 }}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Add File by URL
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add File by URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File URL"
            type="url"
            fullWidth
            variant="standard"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!inputUrl.trim()}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddFileByUrlButton;