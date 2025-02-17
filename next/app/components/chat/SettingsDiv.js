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
import ChatLogic from "../../../src/conversation/chat/ChatLogic";
import useScreenSize from "../../hooks/useScreenSize";

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
  const screenSize = useScreenSize();
  const smallScreen = screenSize === 'xs';

  const chatLogic = new ChatLogic();

  const [models, setModels] = useState([]);
  const [apiTypeModels, setApiTypeModels] = useState([]);
  const [apiTypes, setApiTypes] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const fetchApiTypeModels = async () => {
      try {
        setApiTypeModels(await chatLogic.fetchApiTypeModels());
      } catch (e) {
        setAlertMessage(e.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    };

    fetchApiTypeModels();
  }, []);

  useEffect(() => {
    setApiTypes(chatLogic.getAllApiTypes(apiTypeModels));
    setApiType(chatLogic.getDefaultApiType(apiTypeModels));
  }, [apiTypeModels]);

  useEffect(() => {
    setModels(chatLogic.filterModelsByApiType(apiTypeModels, apiType));
    setModel(chatLogic.filterDefaultModelByApiType(apiTypeModels, apiType));
  }, [apiType]);

  return (
    <>
      <div className="flex-around mt-1">
        <div className="mt-2">
          <FormControl fullWidth size="small">
            <InputLabel id="api-type-select-label">API Type</InputLabel>
            <Select
              labelId="api-type-select-label"
              id="api-type-select"
              value={apiType ? apiType : ''}
              label="API Type"
              variant="outlined"
              onChange={e => setApiType(e.target.value)}
            >
              {apiTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mt-2">
          <FormControl fullWidth size="small">
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model ? model : ''}
              label="Model"
              variant="outlined"
              onChange={e => setModel(e.target.value)}
              renderValue={(selected) => selected}
            >
              {models.map(model => {
                const apiTypeModel = apiTypeModels.find(apiModel => apiModel.model === model);                const price = `Price: Input ${apiTypeModel.input}, Output: ${apiTypeModel.output}`;
                return (
                  <MenuItem key={model} value={model}>
                    <div>
                      <Typography variant="body2">{model}</Typography>
                      <Typography variant="caption" color="textSecondary">{price}</Typography>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        {!smallScreen && (
          <>
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
          </>
        )}
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
    </>
  );
}

export default SettingsDiv;