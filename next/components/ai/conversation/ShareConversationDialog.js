import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment, InputLabel, OutlinedInput,
  Snackbar,
  TextField,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UserLogic from "../../../lib/common/user/UserLogic";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";

function ShareConversationDialog({open, onClose, conversationId}) {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [isLink, setIsLink] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const userLogic = new UserLogic();
  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    if (open && conversationId) {
      fetchUsernames();
      fetchConversationPublicStatus();
    }
  }, [open, conversationId]);

  const publicUrl = useMemo(() => {
    if (!isPublic || !conversationId) return '';
    const origin = window.location.origin;
    return `${origin}/public/conversation/${conversationId}`;
  }, [isPublic, conversationId]);

  const fetchUsernames = async () => {
    try {
      setUsernames(await userLogic.fetchUsernames());
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error(err);
    }
  };

  const fetchConversationPublicStatus = async () => {
    try {
      const conv = await conversationLogic.fetchConversation(conversationId);
      if (conv) {
        setIsPublic(conv.isPublic);
      }
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      if (isLink) {
        await conversationLogic.addUserToConversation(conversationId, selectedUsername);
        setAlertMessage('Conversation shared (link) successfully');
      } else {
        await conversationLogic.addConversationForUser(conversationId, selectedUsername);
        setAlertMessage('Conversation shared (copy) successfully');
      }
      setAlertSeverity('success');
      setAlertOpen(true);
      setSelectedUsername('');
      onClose();
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error(err);
    }
  };

  const handleTogglePublic = async (checked) => {
    try {
      await conversationLogic.updateConversationPublic(conversationId, checked);
      setIsPublic(checked);
      setAlertMessage(`Conversation made ${checked ? 'public' : 'private'}`);
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error(err);
    }
  };

  const copyPublicUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setAlertMessage('Public URL copied');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage('Failed to copy URL');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const openPreview = () => {
    if (publicUrl) window.open(publicUrl, '_blank');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Share Conversation</DialogTitle>
        <DialogContent>
          {/* Preview section */}
          <div>
            <div className="font-semibold mb-1">Make Public</div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e) => handleTogglePublic(e.target.checked)}
                />
              }
              label="Public"
            />
            {isPublic && (
              <div className="mt-2">
                {isPublic && (
                  <div className="mt-2">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="public-url-input">Public URL</InputLabel>
                      <OutlinedInput
                        id="public-url-input"
                        value={publicUrl}
                        readOnly
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip title="Copy URL">
                              <IconButton onClick={copyPublicUrl} size="small">
                                <ContentCopyIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open preview">
                              <IconButton onClick={openPreview} size="small">
                                <OpenInNewIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        }
                        label="Public URL"
                      />
                    </FormControl>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Share with User */}
          <div>
            <div className="font-semibold mb-1 mt-8">Share with User</div>
            <div className="mt-2">
              <Autocomplete
                options={usernames}
                getOptionLabel={(option) => option}
                value={selectedUsername}
                onChange={(event, newValue) => setSelectedUsername(newValue)}
                renderInput={(params) => <TextField {...params} label="Username"/>}
                fullWidth
              />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isLink}
                  onChange={(e) => setIsLink(e.target.checked)}
                />
              }
              label="Link"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleShare} disabled={!selectedUsername}>Share</Button>
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

export default ShareConversationDialog;