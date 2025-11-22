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

function ShareConversationDialog({open, onClose, conversation, setConversation}) {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');

  const [isLink, setIsLink] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();
  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    if (open) {
      fetchUsernames();
    }
  }, [open]);

  const publicUrl = useMemo(() => {
    if (!conversation?.isPublic || !conversation?.id) return '';
    const origin = window.location.origin;
    return `${origin}/public/conversation/${conversation.id}`;
  }, [conversation]);

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

  const handleShare = async () => {
    try {
      if (isLink) {
        const updatedConversation = await conversationLogic.addUserToConversation(
          conversation.id, conversation.version, selectedUsername
        );
        setConversation(updatedConversation);
        setAlertMessage('Conversation shared (link) successfully');
      } else {
        await conversationLogic.cloneConversationForUser(conversation.id, selectedUsername);
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
      const updatedConversation = await conversationLogic.updateConversationPublic(
        conversation.id, conversation.version, checked
      );
      setConversation(updatedConversation);
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
          {/* Make it Public */}
          <div>
            <div className="font-semibold mb-1">Option 1: Make it Public</div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={conversation?.isPublic}
                  onChange={(e) => handleTogglePublic(e.target.checked)}
                />
              }
              label="Public"
            />
            {conversation?.isPublic && (
              <div className="mt-2">
                {conversation?.isPublic && (
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
            <div className="font-semibold mb-1 mt-8">Option 2: Share with User</div>
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
            <div className="flex-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isLink}
                    onChange={(e) => setIsLink(e.target.checked)}
                  />
                }
                label="Link"
              />
              <div className="mt-1">
                <Button
                  onClick={handleShare}
                  disabled={!selectedUsername}
                  variant="contained"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
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