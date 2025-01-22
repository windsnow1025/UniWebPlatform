import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import AnnouncementLogic from '../../../src/announcement/AnnouncementLogic';

const AnnouncementSnackbar = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const announcementLogic = new AnnouncementLogic();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const announcement = await announcementLogic.fetchAnnouncement();
        if (announcement.content) {
          setAlertMessage(announcement.content);
          setAlertOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
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
      <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default AnnouncementSnackbar;