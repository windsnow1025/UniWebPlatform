import React, {useEffect, useState} from "react";
import {Alert, Button, Snackbar, TextField} from "@mui/material";
import {defaultAPIBaseURLs} from "../../../lib/common/APIConfig";

const DeveloperSettings = () => {
  const [apiBaseURLs, setApiBaseURLs] = useState(defaultAPIBaseURLs);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    const storedValue = localStorage.getItem("apiBaseURLs");
    if (storedValue) {
      setApiBaseURLs(JSON.parse(storedValue));
    } else {
      setApiBaseURLs(defaultAPIBaseURLs);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("apiBaseURLs", JSON.stringify(apiBaseURLs));
    setAlertMessage("Saved successfully");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleReset = () => {
    localStorage.removeItem("apiBaseURLs");
    setApiBaseURLs(defaultAPIBaseURLs);
    setAlertMessage("Reset successfully");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  return (
    <div>
      <h2>Developer Settings</h2>
      <div className="py-2">
        <TextField
          label="Nest API Base URL"
          variant="outlined"
          fullWidth
          value={apiBaseURLs.nest}
          onChange={(e) =>
            setApiBaseURLs({...apiBaseURLs, nest: e.target.value})
          }
        />
      </div>
      <div className="py-2">
        <TextField
          label="FastAPI API Base URL"
          variant="outlined"
          fullWidth
          value={apiBaseURLs.fastAPI}
          onChange={(e) =>
            setApiBaseURLs({...apiBaseURLs, fastAPI: e.target.value})
          }
        />
      </div>
      <div className="flex">
        <div className="m-1">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <div className="m-1">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

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