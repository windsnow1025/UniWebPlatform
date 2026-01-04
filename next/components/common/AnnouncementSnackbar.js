import React, {useEffect, useState} from 'react';
import {Alert, Snackbar} from '@mui/material';
import AnnouncementLogic from '@/lib/announcement/AnnouncementLogic';
import TextContent from "@/components/message/content/text/TextContent";
import {RawEditableState} from "@/lib/common/message/EditableState";

const AnnouncementSnackbar = () => {
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const announcementLogic = new AnnouncementLogic();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const announcement = await announcementLogic.fetchAnnouncement();

        if (announcement.content !== "" && announcement.content !== "\n") {
          setAlertMessage(announcement.content);
          setAlertSeverity('info');
          setAlertOpen(true);
        }
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={6000}
      onClose={() => setAlertOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert variant="filled" onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
        <TextContent
          content={alertMessage}
          rawEditableState={RawEditableState.AlwaysFalse}
        />
      </Alert>
    </Snackbar>
  );
};

export default AnnouncementSnackbar;