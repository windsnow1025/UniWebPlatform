import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from "@mui/material";
import {defaultAPIBaseURLs} from "../../../lib/common/APIConfig";

const STORAGE_SELECTED_KEY = "apiBaseURLs";
const STORAGE_OPTIONS_KEY = "apiBaseURLsOptions";

const emptyOptions = {nest: [], fastAPI: []};

const DeveloperSettings = () => {
  const [apiBaseURLs, setApiBaseURLs] = useState(defaultAPIBaseURLs);
  const [options, setOptions] = useState(emptyOptions);
  const [newOption, setNewOption] = useState({nest: "", fastAPI: ""});

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    const storedSelected = localStorage.getItem(STORAGE_SELECTED_KEY);
    if (storedSelected) {
      setApiBaseURLs(JSON.parse(storedSelected));
    }

    const storedOptions = localStorage.getItem(STORAGE_OPTIONS_KEY);
    if (storedOptions) {
      const parsed = JSON.parse(storedOptions);
      setOptions({
        nest: Array.isArray(parsed?.nest) ? parsed.nest : [],
        fastAPI: Array.isArray(parsed?.fastAPI) ? parsed.fastAPI : [],
      });
    }
  }, []);

  const persistSelected = (next) => {
    localStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(next));
  };

  const persistOptions = (next) => {
    localStorage.setItem(STORAGE_OPTIONS_KEY, JSON.stringify(next));
  };

  const handleSelectChange = (key) => (e) => {
    const value = e.target.value;
    const next = {...apiBaseURLs, [key]: value};
    setApiBaseURLs(next);
    persistSelected(next);
  };

  const handleAddOption = (key) => {
    const value = (newOption[key] || "").trim();
    if (!value) {
      setAlertMessage("Please enter a value to add.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    if (value === defaultAPIBaseURLs[key]) {
      setAlertMessage("Cannot add the default value.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    if (options[key].includes(value)) {
      setAlertMessage("This option already exists.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    const next = {...options, [key]: [...options[key], value]};
    setOptions(next);
    persistOptions(next);
    setNewOption({...newOption, [key]: ""});

    setAlertMessage("Option added.");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleRemoveOption = (key, value) => {
    const next = {...options, [key]: options[key].filter((v) => v !== value)};
    setOptions(next);
    persistOptions(next);

    // If removing the currently selected option, fall back to default
    if (apiBaseURLs[key] === value) {
      const fallback = defaultAPIBaseURLs[key];
      const selectedNext = {...apiBaseURLs, [key]: fallback};
      setApiBaseURLs(selectedNext);
      persistSelected(selectedNext);
    }

    setAlertMessage("Option removed.");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const renderSelectBlock = (key, label) => {
    const defaultValue = defaultAPIBaseURLs[key];
    const allOptions = [defaultValue, ...options[key]];

    return (
      <div className="py-2">
        <FormControl variant="filled" fullWidth>
          <InputLabel id={`${key}-label`}>{label}</InputLabel>
          <Select
            labelId={`${key}-label`}
            label={label}
            value={apiBaseURLs[key] || defaultValue}
            onChange={handleSelectChange(key)}
          >
            {allOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="flex-center mt-2">
          <div className="flex-1 mr-2">
            <TextField
              size="small"
              fullWidth
              label={`Add ${label}`}
              value={newOption[key]}
              onChange={(e) => setNewOption({...newOption, [key]: e.target.value})}
            />
          </div>
          <div>
            <Button variant="outlined" onClick={() => handleAddOption(key)}>Add</Button>
          </div>
        </div>

        <List dense className="mt-2">
          {options[key].map((opt) => (
            <ListItem
              key={opt}
              secondaryAction={
                <Button size="small" color="error" onClick={() => handleRemoveOption(key, opt)}>
                  Remove
                </Button>
              }
            >
              <ListItemText primary={opt}/>
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  return (
    <div>
      <h2>Developer Settings</h2>
      <Divider/>
      {renderSelectBlock("nest", "Nest API Base URL")}
      <Divider/>
      {renderSelectBlock("fastAPI", "FastAPI API Base URL")}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: "100%"}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeveloperSettings;