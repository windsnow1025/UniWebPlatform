import React, {useEffect, useState} from 'react';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  Snackbar,
  Alert
} from "@mui/material";
import ChatLogic from "../../../src/conversation/chat/ChatLogic";

function SettingsDiv({
                       apiType,
                       setApiType,
                       model,
                       setModel,
                       temperature,
                       setTemperature,
                       stream,
                       setStream,
                     }) {
  const chatLogic = new ChatLogic();

  const [models, setModels] = useState([]);
  const [apiModels, setApiModels] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  useEffect(() => {
    const fetchApiModels = async () => {
      try {
        const apiModels = await chatLogic.fetchApiModels();
        setApiModels(apiModels);
      } catch (e) {
        setAlertMessage(e.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    };

    fetchApiModels();
  }, []);

  useEffect(() => {
    setModels(chatLogic.filterModelsByApiType(apiModels, apiType));
    setModel(chatLogic.filterDefaultModelByApiType(apiType));
  }, [apiModels, apiType]);

  return (
    <div className="flex-around m-2">
      <div className="m-1">
        <FormControl fullWidth className="mt-2">
          <InputLabel id="api-type-select-label">API Type</InputLabel>
          <Select
            labelId="api-type-select-label"
            id="api-type-select"
            value={apiType}
            label="API Type"
            onChange={e => setApiType(e.target.value)}
          >
            <MenuItem value="open_ai">Open AI</MenuItem>
            <MenuItem value="azure">Azure</MenuItem>
            <MenuItem value="gemini">Gemini</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="m-1">
        <FormControl fullWidth className="mt-2">
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={models.length !== 0 ? model : ''}
            label="Model"
            onChange={e => setModel(e.target.value)}
          >
            {models.length !== 0 && models.map(model => (
              <MenuItem key={model} value={model}>{model}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="m-1">
        <InputLabel htmlFor="temperature">Temperature: {temperature.toFixed(1)}</InputLabel>
        <Slider
          aria-label="Temperature"
          value={temperature}
          onChange={(e, newValue) => setTemperature(newValue)}
          valueLabelDisplay="auto"
          step={0.1}
          marks
          min={0}
          max={2}
        />
      </div>
      <div>
        <FormControlLabel control={
          <Switch checked={stream} onChange={e => setStream(e.target.checked)}/>
        } label="Stream"/>
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

export default SettingsDiv;