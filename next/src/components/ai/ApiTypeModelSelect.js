import React, {useEffect, useMemo, useState} from 'react';
import {Alert, FormControl, InputLabel, ListSubheader, MenuItem, Select, Snackbar, Typography} from "@mui/material";
import ChatLogic from "@/lib/chat/ChatLogic";

function ApiTypeModelSelect({
                              apiType,
                              setApiType,
                              model,
                              setModel,
                            }) {
  const chatLogic = useMemo(() => new ChatLogic(), []);

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
    const defaultApiType = ChatLogic.getDefaultApiType(apiTypeModels);
    setApiTypes(ChatLogic.getAllApiTypes(apiTypeModels));
    setApiType(defaultApiType);
    setModel(ChatLogic.filterDefaultModelByApiType(apiTypeModels, defaultApiType));
  }, [apiTypeModels, setApiType, setModel]);

  const getOptionValue = (apiType, model) => `${apiType}/${model}`;

  const handleChange = (e) => {
    const selected = apiTypeModels.find(
      apiTypeModel => getOptionValue(apiTypeModel.apiType, apiTypeModel.model) === e.target.value
    );
    setApiType(selected.apiType);
    setModel(selected.model);
  };

  return (
    <>
      <div>
        <FormControl fullWidth size="small">
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={apiType && model ? getOptionValue(apiType, model) : ''}
            label="Model"
            variant="outlined"
            onChange={handleChange}
            renderValue={() => model}
          >
            {apiTypes.flatMap(apiType => [
              <ListSubheader key={apiType}>{apiType}</ListSubheader>,
              ...ChatLogic.filterApiTypeModelsByApiType(apiTypeModels, apiType).map(apiTypeModel => {
                const price = `Price: Input ${apiTypeModel.input}, Output: ${apiTypeModel.output}`;
                const optionValue = getOptionValue(apiTypeModel.apiType, apiTypeModel.model);
                return (
                  <MenuItem key={optionValue} value={optionValue}>
                    <div>
                      <Typography variant="body2">{apiTypeModel.model}</Typography>
                      <Typography variant="caption" color="textSecondary">{price}</Typography>
                    </div>
                  </MenuItem>
                );
              }),
            ])}
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
