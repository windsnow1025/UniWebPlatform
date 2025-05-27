import React, {useState} from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

function UrlAdd({setUrl, isUploading}) {
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
      <Tooltip title="Add URL">
        <IconButton
          onClick={() => setOpen(true)}
          disabled={isUploading}
          size="small"
        >
          {isUploading ? <CircularProgress size={20}/> : <LinkIcon fontSize="small"/>}
        </IconButton>
      </Tooltip>
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

export default UrlAdd;