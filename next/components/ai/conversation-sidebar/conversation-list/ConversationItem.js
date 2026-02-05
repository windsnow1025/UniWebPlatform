import React, {useState} from 'react';
import {
  Alert,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  LabelOutlined as LabelOutlinedIcon,
  MoreVert as MoreVertIcon,
  SaveOutlined as SaveOutlinedIcon,
} from '@mui/icons-material';
import {NO_LABEL_COLOR} from './label/PresetColors';
import ConversationLogic from '../../../../lib/conversation/ConversationLogic';

function ConversationItem({
                            conversation,
                            isSelected,
                            isLoading,
                            onSelect,
                            setConversations,
                            onMenuOpen,
                          }) {
  const conversationLogic = new ConversationLogic();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const stopEvent = (e) => {
    e.stopPropagation();
  };

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(conversation.name);
  };

  const handleSave = async (e) => {
    if (e) e.stopPropagation();

    setIsSaving(true);
    try {
      const updatedConversation = await conversationLogic.updateConversationName(
        conversation.id, conversation.version, editName
      );
      setConversations(convos => convos.map(convo =>
        convo.id === updatedConversation.id ? updatedConversation : convo
      ));
      setIsEditing(false);
      setEditName('');
      showAlert('Conversation name updated', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    }
    setIsSaving(false);

    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onMenuOpen(e);
  };

  return (
    <>
      <ListItem dense disablePadding>
        <ListItemButton
          onClick={() => onSelect(conversation.id)}
          selected={isSelected}
        >
          {isEditing ? (
            <TextField
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              fullWidth
              onClick={(e) => e.stopPropagation()}
              onMouseDown={stopEvent}
              onTouchStart={stopEvent}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleSave();
                }
              }}
              size="small"
            />
          ) : (
            <div className="flex-start-center-nowrap w-full min-w-0">
              <LabelOutlinedIcon
                fontSize="small"
                sx={{color: conversation.label?.color || NO_LABEL_COLOR, mr: 2}}
              />
              <ListItemText
                primary={conversation.name}
                slotProps={{primary: {noWrap: true}}}
                secondary={(
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                  >
                    {ConversationLogic.formatDate(conversation.updatedAt)}
                  </Typography>
                )}
              />
            </div>
          )}
          {(isLoading || isSaving) ? (
            <IconButton disabled size="small">
              <CircularProgress size={20}/>
            </IconButton>
          ) : isEditing ? (
            <Tooltip title="Save (Enter)">
              <IconButton
                onClick={handleSave}
                onMouseDown={stopEvent}
                onTouchStart={stopEvent}
              >
                <SaveOutlinedIcon/>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Rename">
              <IconButton
                size="small"
                onClick={startEditing}
                onMouseDown={stopEvent}
                onTouchStart={stopEvent}
              >
                <EditIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip size="small" title="More">
            <IconButton
              onClick={handleMenuClick}
              onMouseDown={stopEvent}
              onTouchStart={stopEvent}
            >
              <MoreVertIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </ListItemButton>
      </ListItem>

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

export default ConversationItem;
