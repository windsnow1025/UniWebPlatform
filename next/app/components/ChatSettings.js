import React from 'react';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Slider, Switch } from "@mui/material";

function ChatSettings({ apiType, setApiType, model, setModel, apiModels, temperature, setTemperature, stream, setStream }) {
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
            value={apiModels.length !== 0 ? model : ''}
            label="Model"
            onChange={e => setModel(e.target.value)}
          >
            {apiModels.length !== 0 && apiModels.map(model => (
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
    </div>
  );
}

export default ChatSettings;