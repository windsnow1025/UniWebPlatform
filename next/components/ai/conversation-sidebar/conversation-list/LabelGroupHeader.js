import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {Settings as SettingsIcon} from '@mui/icons-material';
import ColorDot from './label/ColorDot';
import ColorPicker from './label/ColorPicker';
import LabelLogic from '../../../../lib/label/LabelLogic';
import ConfirmDialog from '../../../common/ConfirmDialog';

function LabelGroupHeader({
                            label,
                            count,
                            isNoLabel,
                            setLabels,
                            setConversations,
                          }) {
  const labelLogic = new LabelLogic();

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const openEditDialog = (e) => {
    e.stopPropagation();
    setEditName(label.name);
    setEditColor(label.color);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedLabel = await labelLogic.updateLabel(label.id, editName.trim(), editColor);
      setLabels(prev => prev.map(l => l.id === updatedLabel.id ? updatedLabel : l));
      setConversations(prev => prev.map(conversation =>
        conversation.label?.id === updatedLabel.id ? {...conversation, label: updatedLabel} : conversation
      ));
      setEditDialogOpen(false);
      showAlert('Label updated', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await labelLogic.deleteLabel(label.id);
      setLabels(prev => prev.filter(l => l.id !== label.id));
      setConversations(prev => prev.map(c =>
        c.label?.id === label.id ? {...c, label: null} : c
      ));
      showAlert('Label deleted', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <ColorDot color={label.color} sx={{mr: 2}}/>
      <Typography variant="subtitle2" className="flex-1">
        {label.name} ({count})
      </Typography>
      {!isNoLabel && (
        <Tooltip title="Edit label">
          <IconButton size="small" onClick={openEditDialog}>
            <SettingsIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      )}

      {/* Edit Label Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
            <TextField
              label="Label name"
              size="small"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              autoFocus
            />
            <ColorPicker
              color={editColor}
              setColor={setEditColor}
              size={24}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'space-between', px: 3, pb: 2}}>
          <Button
            color="error"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Box sx={{display: 'flex', gap: 1}}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isSaving || !editName.trim()}
            >
              {isSaving ? <CircularProgress size={16}/> : 'Save'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={(confirmed) => {
            if (confirmed) {
              handleDeleteConfirm();
            } else {
              setDeleteDialogOpen(false);
            }
          }}
          title="Delete Label"
          content={`Are you sure you want to delete the label "${label.name}"? Conversations using this label will become unlabeled.`}
        />
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
    </>
  );
}

export default LabelGroupHeader;
