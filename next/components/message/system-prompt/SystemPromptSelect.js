import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteIcon from '@mui/icons-material/Delete';
import SystemPromptLogic from '../../../lib/system-prompt/SystemPromptLogic';
import FileLogic from '../../../lib/common/file/FileLogic';
import {ContentTypeEnum} from '../../../client/nest';

function SystemPromptSelect({
                              message,
                              setMessage,
                              setConversationUpdateKey,
                            }) {
  const systemPromptLogic = new SystemPromptLogic();

  // System prompts list
  const [systemPrompts, setSystemPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Save as new dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  // Unlink dialog
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selectedSystemPromptId = message.systemPromptId || '';

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    fetchSystemPrompts();
  }, []);

  const fetchSystemPrompts = async () => {
    setLoading(true);
    try {
      const prompts = await systemPromptLogic.fetchSystemPrompts();
      setSystemPrompts(prompts);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (event) => {
    const value = event.target.value;

    if (value === 'save-new') {
      setSaveDialogOpen(true);
      return;
    }

    if (value === 'unlink') {
      setUnlinkDialogOpen(true);
      return;
    }

    if (value === '') {
      return;
    }

    const selectedPrompt = systemPrompts.find(systemPrompt => systemPrompt.id === value);
    if (selectedPrompt) {
      setMessage(message.id, {
        ...message,
        systemPromptId: selectedPrompt.id,
        contents: selectedPrompt.contents,
      });
      setConversationUpdateKey(prev => prev + 1);
    }
  };

  const handleSaveAsNew = async () => {
    setSaving(true);
    try {
      const newSystemPrompt = await systemPromptLogic.saveSystemPrompt({
        name: newName.trim(),
        contents: message.contents,
      });

      setMessage(message.id, {
        ...message,
        systemPromptId: newSystemPrompt.id,
      });
      setConversationUpdateKey(prev => prev + 1);

      await fetchSystemPrompts();

      setSaveDialogOpen(false);
      setNewName('');
      showAlert('System prompt saved', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Unlink from system prompt
  const handleUnlink = async (keepContent) => {
    setUnlinking(true);
    try {
      if (keepContent) {
        // Clone files if any
        const fileLogic = new FileLogic();
        const storageUrl = await fileLogic.getStorageUrl();

        const newContents = JSON.parse(JSON.stringify(message.contents || []));
        const fileUrls = newContents
          .filter(c => c.type === ContentTypeEnum.File)
          .map(c => c.data);

        const storageFilenames = FileLogic.getStorageFilenamesFromUrls(fileUrls, storageUrl);

        if (storageFilenames.length > 0) {
          const clonedUrls = await fileLogic.cloneFiles(storageFilenames);
          const urlMapping = new Map();
          storageFilenames.forEach((filename, idx) => {
            const originalUrl = fileUrls.find(
              url => FileLogic.getStorageFilenameFromUrl(url, storageUrl) === filename
            );
            if (originalUrl) {
              urlMapping.set(originalUrl, clonedUrls[idx]);
            }
          });

          // Replace file urls in contents
          for (const content of newContents) {
            if (content.type === ContentTypeEnum.File && urlMapping.has(content.data)) {
              content.data = urlMapping.get(content.data);
            }
          }
        }

        setMessage(message.id, {
          ...message,
          systemPromptId: undefined,
          contents: newContents,
        });
      } else {
        // Clear contents
        setMessage(message.id, {
          ...message,
          systemPromptId: undefined,
          contents: [{type: ContentTypeEnum.Text, data: ''}],
        });
      }

      setConversationUpdateKey(prev => prev + 1);
      setUnlinkDialogOpen(false);
      showAlert('Unlinked from system prompt', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setUnlinking(false);
    }
  };

  // Delete a system prompt
  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setDeleting(true);
    try {
      const deletedPrompt = await systemPromptLogic.deleteSystemPrompt(deletingId);

      // Delete files from the deleted system prompt
      const fileLogic = new FileLogic();
      const storageUrl = await fileLogic.getStorageUrl();
      const fileUrls = (deletedPrompt.contents || [])
        .filter(c => c.type === ContentTypeEnum.File)
        .map(c => c.data);
      const fileNames = FileLogic.getStorageFilenamesFromUrls(fileUrls, storageUrl);

      if (fileNames.length > 0) {
        await fileLogic.deleteFiles(fileNames);
      }

      // If current message was linked to deleted prompt, unlink it
      if (message.systemPromptId === deletingId) {
        setMessage(message.id, {
          ...message,
          systemPromptId: undefined,
          contents: [{type: ContentTypeEnum.Text, data: ''}],
        });
        setConversationUpdateKey(prev => prev + 1);
      }

      await fetchSystemPrompts();
      setDeleteDialogOpen(false);
      setDeletingId(null);
      showAlert('System prompt deleted', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Sync message changes to system prompt
  const handleContentsSync = async () => {
    if (!message.systemPromptId) return;

    const currentPrompt = systemPrompts.find(sp => sp.id === message.systemPromptId);
    if (!currentPrompt) return;

    try {
      await systemPromptLogic.updateSystemPrompt(
        message.systemPromptId,
        String(currentPrompt.version),
        {
          name: currentPrompt.name,
          contents: message.contents,
        }
      );
      await fetchSystemPrompts();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  // Sync when contents change (if linked)
  useEffect(() => {
    if (message.systemPromptId && message.contents) {
      handleContentsSync();
    }
  }, [message.contents]);

  return (
    <>
      <FormControl size="small" sx={{minWidth: 160, ml: 1}}>
        <InputLabel id="system-prompt-select-label">System Prompt</InputLabel>
        <Select
          labelId="system-prompt-select-label"
          value={selectedSystemPromptId}
          onChange={handleSelect}
          label="System Prompt"
          disabled={loading}
          renderValue={(value) => {
            const prompt = systemPrompts.find(sp => sp.id === value);
            return prompt ? prompt.name : '';
          }}
        >
          {/* Save as new option */}
          <MenuItem value="save-new">
            <ListItemIcon><AddIcon fontSize="small"/></ListItemIcon>
            <ListItemText>Save as New</ListItemText>
          </MenuItem>

          {/* Unlink option (only when linked) */}
          {selectedSystemPromptId && (
            <MenuItem value="unlink">
              <ListItemIcon><LinkOffIcon fontSize="small"/></ListItemIcon>
              <ListItemText>Unlink</ListItemText>
            </MenuItem>
          )}

          <Divider/>

          {/* List of system prompts */}
          {systemPrompts.map((sp) => (
            <MenuItem key={sp.id} value={sp.id}>
              <ListItemText primary={sp.name}/>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => handleDeleteClick(e, sp.id)}
                sx={{ml: 1}}
              >
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </MenuItem>
          ))}

          {systemPrompts.length === 0 && !loading && (
            <MenuItem disabled>No saved system prompts</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Save as New Dialog */}
      <Dialog open={saveDialogOpen} onClose={saving ? undefined : () => setSaveDialogOpen(false)}>
        <DialogTitle>Save as New System Prompt</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newName.trim() && handleSaveAsNew()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSaveAsNew}
            variant="contained"
            disabled={saving || !newName.trim()}
            startIcon={saving ? <CircularProgress size={16}/> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unlink Dialog */}
      <Dialog open={unlinkDialogOpen} onClose={unlinking ? undefined : () => setUnlinkDialogOpen(false)}>
        <DialogTitle>Unlink from System Prompt</DialogTitle>
        <DialogContent>
          Do you want to keep the current content?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnlinkDialogOpen(false)} disabled={unlinking}>Cancel</Button>
          <Button
            onClick={() => handleUnlink(false)}
            disabled={unlinking}
            color="error"
          >
            Discard Content
          </Button>
          <Button
            onClick={() => handleUnlink(true)}
            variant="contained"
            disabled={unlinking}
            startIcon={unlinking ? <CircularProgress size={16}/> : null}
          >
            Keep Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={deleting ? undefined : () => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete System Prompt</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this system prompt? This will also delete any associated files.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16}/> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SystemPromptSelect;
