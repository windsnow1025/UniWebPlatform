import React, {useEffect, useMemo, useState} from 'react';
import {Alert, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography} from "@mui/material";
import ChatLogic from "@/lib/chat/ChatLogic";

function ApiTypeModelSelect({
                              apiType,
                              setApiType,
                              model,
                              setModel,
                            }) {
  const chatLogic = useMemo(() => new ChatLogic(), []);

  const [filteredApiTypeModels, setFilteredApiTypeModels] = useState([]);
  const [apiTypeModels, setApiTypeModels] = useState([]);
  const [apiTypes, setApiTypes] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const fetchApiTypeModels = async () => {
      try {
        setApiTypeModels(await chatLogic.fetchApiTypeModels());
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    };

    fetchApiTypeModels();
  }, [chatLogic]);

  useEffect(() => {
    setApiTypes(ChatLogic.getAllApiTypes(apiTypeModels));
    setApiType(ChatLogic.getDefaultApiType(apiTypeModels));
  }, [apiTypeModels, setApiType]);

  useEffect(() => {
    setFilteredApiTypeModels(ChatLogic.filterApiTypeModelsByApiType(apiTypeModels, apiType));
    setModel(ChatLogic.filterDefaultModelByApiType(apiTypeModels, apiType));
  }, [apiType, apiTypeModels, setModel]);

  return (
    <>
      <div>
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
      <div>
        <FormControl fullWidth size="small">
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={model || ''}
            label="Model"
            variant="outlined"
            onChange={e => setModel(e.target.value)}
            renderValue={(selected) => selected}
          >
            {filteredApiTypeModels.map(apiTypeModel => {
              const price = `Price: Input ${apiTypeModel.input}, Output: ${apiTypeModel.output}`;
              return (
                <MenuItem key={apiTypeModel.model} value={apiTypeModel.model}>
                  <div>
                    <Typography variant="body2">{apiTypeModel.model}</Typography>
                    <Typography variant="caption" color="textSecondary">{price}</Typography>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
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

export default ApiTypeModelSelect;
