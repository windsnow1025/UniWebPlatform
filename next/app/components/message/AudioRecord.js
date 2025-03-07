import React, {useState} from 'react';
import {Alert, CircularProgress, IconButton, Snackbar, Tooltip} from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import FileLogic from "../../../src/common/file/FileLogic";

function AudioRecord({ files, setFiles, setUploadProgress }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileLogic = new FileLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });

        await uploadAudio(audioFile);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setAlertMessage("Failed to start recording");
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const uploadAudio = async (audioFile) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = await fileLogic.uploadFiles([audioFile], (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        setUploadProgress(progress);
      });

      setFiles([...files, uploadedUrls[0]]);

      setAlertMessage("Audio uploaded successfully");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
        <IconButton aria-label="record-audio" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <StopIcon color="error" /> : <MicIcon />}
        </IconButton>
      </Tooltip>
      {isUploading && <CircularProgress size={24} />}
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

export default AudioRecord;