import React, {useEffect, useMemo, useState} from "react";
import {
  Alert,
  Button,
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

const APIBaseURLSelect = ({apiType, label}) => {
  const [selected, setSelected] = useState(defaultAPIBaseURLs);
  const [options, setOptions] = useState({nest: [], fastAPI: []});

  const [newUrl, setNewUrl] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const getStoredSelectedOrDefault = () => {
    const defaultSelected = defaultAPIBaseURLs;
    const storedSelectedString = localStorage.getItem(STORAGE_SELECTED_KEY);
    if (storedSelectedString) {
      let storedSelected;
      try {
        storedSelected = JSON.parse(storedSelectedString);
        if (!storedSelected || !storedSelected.nest || !storedSelected.fastAPI) {
          localStorage.removeItem(STORAGE_SELECTED_KEY);
          return defaultSelected;
        } else {
          return storedSelected;
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_SELECTED_KEY);
        return defaultSelected;
      }
    } else {
      return defaultSelected;
    }
  }

  const getStoredOptionsOrDefault = () => {
    const defaultOptions = {nest: [], fastAPI: []};
    const storedOptionsString = localStorage.getItem(STORAGE_OPTIONS_KEY);
    if (storedOptionsString) {
      let storedOptions;
      try {
        storedOptions = JSON.parse(storedOptionsString);
        if (!storedOptions || !storedOptions.nest || !storedOptions.fastAPI) {
          localStorage.removeItem(STORAGE_OPTIONS_KEY);
          return defaultOptions;
        } else {
          return storedOptions;
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_OPTIONS_KEY);
        return defaultOptions;
      }
    } else {
      return defaultOptions;
    }
  }

  useEffect(() => {
    const selected = getStoredSelectedOrDefault();
    setSelected(selected);
    const options = getStoredOptionsOrDefault();
    setOptions(options);
  }, []);

  const persistSelected = (selected) => {
    localStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(selected));
  };

  const persistOptions = (options) => {
    localStorage.setItem(STORAGE_OPTIONS_KEY, JSON.stringify(options));
  };

  const typeDefault = defaultAPIBaseURLs[apiType];
  const typeSelected = selected[apiType] || typeDefault;
  const allOptions = useMemo(() => {
    return [typeDefault, ...options[apiType]]
  }, [typeDefault, options, apiType]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    const currentSelected = getStoredSelectedOrDefault();
    const newSelected = {...currentSelected, [apiType]: value};
    setSelected(newSelected);
    persistSelected(newSelected);
  };

  const handleAdd = () => {
    const value = (newUrl || "").trim();
    if (!value) {
      setAlertMessage("Please enter a value to add.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    if (value === typeDefault) {
      setAlertMessage("Cannot add the default value.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    const currentOptions = getStoredOptionsOrDefault();
    if (currentOptions[apiType].includes(value)) {
      setAlertMessage("This option already exists.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    const newOptions = {...currentOptions, [apiType]: [...currentOptions[apiType], value]};
    setOptions(newOptions);
    persistOptions(newOptions);
    setNewUrl("");

    setAlertMessage("Option added.");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleRemove = (value) => {
    const currentOptions = getStoredOptionsOrDefault();
    const newOptions = {...currentOptions, [apiType]: currentOptions[apiType].filter((v) => v !== value)};
    setOptions(newOptions);
    persistOptions(newOptions);

    if (selected[apiType] === value) {
      const currentSelected = getStoredSelectedOrDefault();
      const newSelected = {...currentSelected, [apiType]: typeDefault};
      setSelected(newSelected);
      persistSelected(newSelected);
    }

    setAlertMessage("Option removed.");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  return (
    <div className="py-2">
      <FormControl variant="filled" fullWidth>
        <InputLabel id={`${apiType}-label`}>{label}</InputLabel>
        <Select
          labelId={`${apiType}-label`}
          label={label}
          value={typeSelected}
          onChange={handleSelectChange}
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
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <Button variant="outlined" onClick={handleAdd}>Add</Button>
      </div>

      <List dense className="mt-2">
        {options[apiType].map((option) => (
          <ListItem
            key={option}
            secondaryAction={
              <Button size="small" color="error" onClick={() => handleRemove(option)}>
                Remove
              </Button>
            }
          >
            <ListItemText primary={option}/>
          </ListItem>
        ))}
      </List>

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

export default APIBaseURLSelect;
