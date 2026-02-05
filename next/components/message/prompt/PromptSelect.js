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
import PromptLogic from '../../../lib/prompt/PromptLogic';
import FileLogic from '../../../lib/common/file/FileLogic';
import {ContentTypeEnum} from '../../../client/nest';

function PromptSelect({
                              message,
                              setMessage,
                              setConversationUpdateKey,
                            }) {
  const fileLogic = new FileLogic();
  const promptLogic = new PromptLogic();

  // Prompts list
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Save dialog
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

  const selectedPromptId = message.promptId || '';

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const prompts = await promptLogic.fetchPrompts();
      setPrompts(prompts);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (event) => {
    const value = event.target.value;

    if (value === 'save') {
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

    const selectedPrompt = prompts.find(prompt => prompt.id === value);
    if (selectedPrompt) {
      setMessage(message.id, {
        ...message,
        promptId: selectedPrompt.id,
        contents: selectedPrompt.contents,
      });
      setConversationUpdateKey(prev => prev + 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newPrompt = await promptLogic.savePrompt({
        name: newName.trim(),
        contents: message.contents,
      });

      setMessage(message.id, {
        ...message,
        promptId: newPrompt.id,
      });
      setConversationUpdateKey(prev => prev + 1);

      await fetchPrompts();

      setSaveDialogOpen(false);
      setNewName('');
      showAlert('Prompt saved', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async (keepContent) => {
    setUnlinking(true);
    try {
      if (!keepContent) {
        setMessage(message.id, {
          ...message,
          promptId: undefined,
          contents: [{type: ContentTypeEnum.Text, data: ''}],
        });
      } else {
        const newContents = JSON.parse(JSON.stringify(message.contents));
        const fileUrls = newContents
          .filter(content => content.type === ContentTypeEnum.File)
          .map(content => content.data);

        const urlMapping = await fileLogic.cloneFileUrls(fileUrls);

        for (const content of newContents) {
          if (content.type === ContentTypeEnum.File) {
            const storageFilename = await fileLogic.getStorageFilenameFromUrl(content.data);
            if (storageFilename) {
              content.data = urlMapping.get(content.data);
            }
          }
        }

        setMessage(message.id, {
          ...message,
          promptId: undefined,
          contents: newContents,
        });
      }

      setConversationUpdateKey(prev => prev + 1);
      setUnlinkDialogOpen(false);
      showAlert('Unlinked from prompt', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setUnlinking(false);
    }
  };

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setDeleting(true);
    try {
      const deletedPrompt = await promptLogic.deletePrompt(deletingId);

      // Delete the files from storage
      const fileUrls = (deletedPrompt.contents)
        .filter(content => content.type === ContentTypeEnum.File)
        .map(content => content.data);
      const fileNames = await fileLogic.getStorageFilenamesFromUrls(fileUrls);

      if (fileNames.length > 0) {
        await fileLogic.deleteFiles(fileNames);
      }

      // If current message was linked to deleted prompt, unlink it
      if (message.promptId === deletingId) {
        setMessage(message.id, {
          ...message,
          promptId: undefined,
          contents: [{type: ContentTypeEnum.Text, data: ''}],
        });
        setConversationUpdateKey(prev => prev + 1);
      }

      await fetchPrompts();
      setDeleteDialogOpen(false);
      setDeletingId(null);
      showAlert('Prompt deleted', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleContentsUpdate = async () => {
    if (!message.promptId) return;

    const currentPrompt = prompts.find(prompt => prompt.id === message.promptId);
    if (!currentPrompt) return;

    try {
      await promptLogic.updatePrompt(
        message.promptId,
        currentPrompt.version,
        {
          name: currentPrompt.name,
          contents: message.contents,
        }
      );
      await fetchPrompts();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  useEffect(() => {
    if (message.promptId) {
      handleContentsUpdate();
    }
  }, [message.contents]);

  return (
    <>
      <FormControl size="small" sx={{minWidth: 160, ml: 1}}>
        <InputLabel id="prompt-select-label">Prompt</InputLabel>
        <Select
          labelId="prompt-select-label"
          value={selectedPromptId}
          onChange={handleSelect}
          label="Prompt"
          disabled={loading}
          renderValue={(value) => {
            const prompt = prompts.find(sp => sp.id === value);
            return prompt ? prompt.name : '';
          }}
        >
          {/* Save option */}
          {!selectedPromptId && (
            <MenuItem value="save">
              <ListItemIcon><AddIcon fontSize="small"/></ListItemIcon>
              <ListItemText>Save</ListItemText>
            </MenuItem>
          )}

          {/* Unlink option */}
          {selectedPromptId && (
            <MenuItem value="unlink">
              <ListItemIcon><LinkOffIcon fontSize="small"/></ListItemIcon>
              <ListItemText>Unlink</ListItemText>
            </MenuItem>
          )}

          <Divider/>

          {/* List of prompts */}
          {prompts.map((sp) => (
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

          {prompts.length === 0 && !loading && (
            <MenuItem disabled>No saved prompts</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={saving ? undefined : () => setSaveDialogOpen(false)}>
        <DialogTitle>Save Prompt</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newName.trim() && handleSave()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSave}
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
        <DialogTitle>Unlink from Prompt</DialogTitle>
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
        <DialogTitle>Delete Prompt?</DialogTitle>
        <DialogContent>
          This will make the prompt unavailable for any conversations using it.
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

export default PromptSelect;
