import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import FileLogic from "../../../lib/common/file/FileLogic";
import {ContentTypeEnum} from "../../../client/nest";

function SaveAsConversationDialog({
  open,
  onClose,
  conversationId,
  defaultName,
  onSaved,
}) {
  const [name, setName] = useState(defaultName);
  const [saving, setSaving] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    if (open) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  const handleSave = async () => {
    if (!conversationId) return;
    const newName = name.trim();
    if (!newName) {
      setAlertMessage('Please enter a name');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    setSaving(true);
    try {
      const conversation = await conversationLogic.fetchConversation(conversationId);

      const newMessages = JSON.parse(JSON.stringify(conversation.messages));
      const fileLogic = new FileLogic();
      const storageUrl = await fileLogic.getStorageUrl();

      // 1) Collect all file urls from messages
      const fileUrls = [];
      for (const msg of newMessages) {
        if (!msg?.contents) continue;
        for (const content of msg.contents) {
          if (content.type === ContentTypeEnum.File) {
            fileUrls.push(content.data);
          }
        }
      }

      // 2) Filter to server-hosted files and clone them
      const storageFilenames = FileLogic.getStorageFilenamesFromUrls(fileUrls, storageUrl);

      let urlMapping = new Map();
      if (storageFilenames.length > 0) {
        const clonedUrls = await fileLogic.cloneFiles(storageFilenames);
        storageFilenames.forEach((filename, idx) => {
          const storageFileUrl = fileUrls.find(
            fileUrl => FileLogic.getStorageFilenameFromUrl(fileUrl, storageUrl) === filename
          );
          if (storageFileUrl) {
            urlMapping.set(storageFileUrl, clonedUrls[idx]);
          }
        });
      }

      // 3) Replace file urls in message contents with the newly cloned urls
      for (const msg of newMessages) {
        if (!msg?.contents) continue;
        for (const content of msg.contents) {
          if (content.type === ContentTypeEnum.File) {
            const serverFilenames = FileLogic.getStorageFilenameFromUrl(content.data, storageUrl);
            if (serverFilenames) {
              content.data = urlMapping.get(content.data);
            }
          }
        }
      }

      const newConversation = await conversationLogic.addConversation({
        name: newName,
        messages: newMessages,
      });

      if (onSaved) onSaved(newConversation);
      onClose();
      setAlertMessage('Conversation saved as new');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth>
        <DialogTitle>Save Conversation As</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label="New name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16}/> : null}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default SaveAsConversationDialog;
