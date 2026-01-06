import React, {useEffect, useRef, useState} from 'react';
import {Alert, Avatar, Box, Button, CircularProgress, Snackbar, Typography} from '@mui/material';
import UserLogic from '../../../../../lib/common/user/UserLogic';
import FileLogic from '../../../../../lib/common/file/FileLogic';
import {useSession} from "@toolpad/core";

function AvatarSection() {
  const session = useSession();

  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const fileInputRef = useRef(null);
  const userLogic = new UserLogic();
  const fileLogic = new FileLogic();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!session) return;
    setUsername(session.user.name);
    setAvatar(session.user.image);
  }, [session]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    await handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!file) {
      showAlert('Please select an image first', 'warning');
      return;
    }

    try {
      setIsUploading(true);

      const urls = await fileLogic.uploadFiles([file]);

      if (urls && urls.length > 0) {
        showAlert('Image uploaded successfully. Click Update to set as avatar.', 'success');
        setPreviewUrl(urls[0]);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateAvatar = async () => {
    if (!previewUrl) {
      showAlert('Please upload an image first', 'warning');
      return;
    }

    try {
      setIsUpdating(true);

      const oldAvatarUrl = avatar;

      const updatedUser = await userLogic.updateAvatar(previewUrl);
      setAvatar(updatedUser.avatar);
      showAlert('Avatar updated successfully', 'success');
      setPreviewUrl(null);

      // Delete the old avatar file from storage if it exists
      if (oldAvatarUrl) {
        try {
          const oldFilename = await fileLogic.getStorageFilenameFromUrl(oldAvatarUrl);
          if (oldFilename) {
            await fileLogic.deleteFiles([oldFilename]);
          }
        } catch (err) {
          showAlert('Failed to delete old avatar file from storage', 'warning');
        }
      }
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClickSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <Typography variant="h6">
        {username}
      </Typography>

      <Avatar
        alt={`${username}'s Avatar`}
        src={avatar || 'placeholder.png'}
        sx={{width: 56, height: 56}}
      />

      {previewUrl && previewUrl !== avatar && (
        <Box className="flex flex-col items-center">
          <Typography variant="body2" gutterBottom>
            Preview:
          </Typography>
          <Avatar
            alt="Preview"
            src={previewUrl}
            sx={{width: 56, height: 56}}
          />
        </Box>
      )}

      <input
        type="file"
        accept="image/*"
        style={{display: 'none'}}
        onChange={handleFileSelect}
        ref={fileInputRef}
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button
          variant="outlined"
          onClick={handleClickSelectFile}
          disabled={isUploading || isUpdating}
          fullWidth
          sx={{whiteSpace: 'nowrap'}}
        >
          {isUploading ? (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <CircularProgress size={24} sx={{mr: 1}}/>
            </Box>
          ) : (
            'Upload'
          )}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateAvatar}
          disabled={!previewUrl || isUploading || isUpdating}
          fullWidth
          sx={{whiteSpace: 'nowrap'}}
        >
          {isUpdating ? <CircularProgress size={24}/> : 'Confirm'}
        </Button>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AvatarSection;