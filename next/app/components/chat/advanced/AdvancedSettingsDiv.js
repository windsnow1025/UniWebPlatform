import React, {useEffect, useState} from 'react';
import {
  Alert,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Switch,
  Typography
} from "@mui/material";
import ChatLogic from "../../../../src/conversation/chat/ChatLogic";

function AdvancedSettingsDiv({
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
  const [alertSeverity, setAlertSeverity] = useState('info');

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
    <div className="flex-around m-1">
      <div className="mx-1">
        <FormControl fullWidth size="small" className="mt-2">
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
            <MenuItem value="github">GitHub</MenuItem>
            <MenuItem value="gemini">Gemini</MenuItem>
            <MenuItem value="claude">Claude</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="mx-1">
        <FormControl fullWidth size="small" className="mt-2">
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
      <div className="mx-1">
        <Typography variant="body1">Temperature</Typography>
        <Slider
          id="temperature"
          value={temperature}
          onChange={(e, newValue) => setTemperature(newValue)}
          valueLabelDisplay="auto"
          step={0.1}
          marks
          min={0}
          max={2}
          size="small"
        />
      </div>
      <div className="mx-1">
        <FormControlLabel control={
          <Switch
            checked={stream}
            onChange={e => setStream(e.target.checked)}
            size="small"
          />
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

export default AdvancedSettingsDiv;