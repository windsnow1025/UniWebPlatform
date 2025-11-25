import React, {useState, useEffect} from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import FileLogic from "../../../../lib/common/file/FileLogic";

function UrlAdd({setUrl, isUploading}) {
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [fileUrls, setFileUrls] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    if (open) {
      setLoadingFiles(true);
      const fileLogic = new FileLogic();

      const fetchFilesAsync = async () => {
        try {
          const urls = await fileLogic.fetchFiles();
          setFileUrls(urls);
        } catch (err) {
          setAlertMessage(err.message || 'Failed to fetch files');
          setAlertSeverity('error');
          setAlertOpen(true);
        } finally {
          setLoadingFiles(false);
        }
      };

      fetchFilesAsync();
    }
  }, [open]);

  const handleAdd = async () => {
    const fileUrl = inputUrl.trim();
    if (!fileUrl) return;

    if (fileUrls.includes(fileUrl)) {
      const fileLogic = new FileLogic();
      try {
        const storageUrl = await fileLogic.getStorageUrl();
        const storageFilename = FileLogic.getStorageFilenameFromUrl(fileUrl, storageUrl);

        const cloned = await fileLogic.cloneFiles([storageFilename]);
        if (!cloned || cloned.length === 0) {
          throw new Error('Failed to clone file');
        }
        setUrl(cloned[0]);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }
    } else {
      setUrl(fileUrl);
    }
    setInputUrl('');
    setOpen(false);
  };

  const handleDialogKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <>
      <Tooltip title="Add URL">
        <IconButton
          onClick={() => setOpen(true)}
          disabled={isUploading}
          size="small"
        >
          {isUploading ? <CircularProgress size={20}/> : <LinkIcon fontSize="small"/>}
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} onKeyDown={handleDialogKeyDown}>
        <DialogTitle>Add File by URL</DialogTitle>
        <DialogContent>
          <div className="mb-1">
            <TextField
              autoFocus
              label="File URL"
              type="url"
              fullWidth
              variant="standard"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
            />
          </div>
          <FormControl fullWidth variant="standard" disabled={loadingFiles}>
            <InputLabel id="select-file-url-label">Select from uploads</InputLabel>
            <Select
              labelId="select-file-url-label"
              value={inputUrl && fileUrls.includes(inputUrl) ? inputUrl : ''}
              onChange={e => setInputUrl(e.target.value)}
              label="Select from uploaded files"
              variant="standard"
            >
              {fileUrls.map(url => (
                <MenuItem key={url} value={url}>
                  <Typography variant="body2">
                    {url.split('/').pop()}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loadingFiles && (
            <div className="flex mt-1">
              <CircularProgress size={18} sx={{mr: 1}}/>
              <Typography variant="caption">Loading files...</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!inputUrl.trim()}>Add</Button>
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

export default UrlAdd;