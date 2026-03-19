import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AnnouncementLogic from '@/lib/announcement/AnnouncementLogic';
import TextContent from '@/components/message/content/text/TextContent';
import {RawEditableState} from '@/lib/common/message/EditableState';
import MenuButton from '@/components/common/dashboard/components/MenuButton';

export default function AnnouncementBell() {
  const [announcement, setAnnouncement] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error' | 'info'>('info');
  const announcementLogic = React.useMemo(() => new AnnouncementLogic(), []);

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  React.useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const result = await announcementLogic.fetchAnnouncement();
        if (result.content !== '' && result.content !== '\n') {
          setAnnouncement(result.content);
        }
      } catch (err: any) {
        showAlert(err.message, 'error');
      }
    };
    fetchAnnouncement();
  }, [announcementLogic]);

  const hasAnnouncement = announcement !== '';

  return (
    <>
      <MenuButton
        showBadge={hasAnnouncement}
        aria-label="Open notifications"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <NotificationsRoundedIcon />
      </MenuButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div className="p-4">
          {hasAnnouncement ? (
            <TextContent
              content={announcement}
              setContent={() => {}}
              rawEditableState={RawEditableState.AlwaysFalse}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No announcements
            </Typography>
          )}
        </div>
      </Popover>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert variant="filled" onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
