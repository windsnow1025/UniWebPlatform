import React, {useState} from 'react';
import {Alert, Box, CircularProgress, IconButton, Snackbar, TextField, Tooltip, Typography} from '@mui/material';
import {Delete as DeleteIcon, SaveOutlined as SaveOutlinedIcon, Settings as SettingsIcon} from '@mui/icons-material';
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

  const [isEditing, setIsEditing] = useState(false);
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

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(label.name);
    setEditColor(label.color);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!editName.trim()) {
      showAlert('Label name is required', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const updatedLabel = await labelLogic.updateLabel(label.id, editName.trim(), editColor);
      setLabels(prev => prev.map(l => l.id === updatedLabel.id ? updatedLabel : l));
      setConversations(prev => prev.map(c =>
        c.label?.id === updatedLabel.id ? {...c, label: updatedLabel} : c
      ));
      setIsEditing(false);
      showAlert('Label updated', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
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

  if (isEditing) {
    return (
      <>
        <Box sx={{display: 'flex', alignItems: 'center', width: '100%', gap: 1}}>
          <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, gap: 1}}>
            <TextField
              size="small"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              fullWidth
            />
            <ColorPicker
              color={editColor}
              setColor={setEditColor}
              size={20}
              stopPropagation={true}
            />
          </Box>
          <IconButton size="small" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={16}/> : <SaveOutlinedIcon fontSize="small"/>}
          </IconButton>
        </Box>

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

  return (
    <>
      <ColorDot color={label.color} sx={{mr: 2}}/>
      <Typography variant="subtitle2" className="flex-1">
        {label.name} ({count})
      </Typography>
      {!isNoLabel && (
        <>
          <Tooltip title="Edit label">
            <IconButton size="small" onClick={startEditing}>
              <SettingsIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete label">
            <IconButton size="small" onClick={handleDeleteClick}>
              <DeleteIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </>
      )}

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
