import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import AnnouncementLogic from '../../../src/announcement/AnnouncementLogic';

const AnnouncementSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const announcementLogic = new AnnouncementLogic();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const announcement = await announcementLogic.fetchAnnouncement();
        if (announcement.content) {
          setMessage(announcement.content);
          setOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AnnouncementSnackbar;