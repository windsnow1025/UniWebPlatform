import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog({
                                        open,
                                        onClose,
                                        title,
                                        content,
                                        disableBackdropClose = false,
                                        isLoading = false,
                                      }) {
  return (
    <Dialog
      open={open}
      onClose={disableBackdropClose || isLoading ? undefined : () => onClose(false)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={isLoading}>Cancel</Button>
        <Button
          onClick={() => onClose(true)}
          autoFocus
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16}/> : null}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
