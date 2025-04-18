import React, {useEffect, useState} from "react";
import {Button, TextField} from "@mui/material";
import {defaultAPIBaseURLs} from "../../../../lib/common/APIConfig";

const DeveloperSettings = () => {
  const [apiBaseURLs, setApiBaseURLs] = useState(defaultAPIBaseURLs);

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
  };

  const handleReset = () => {
    localStorage.removeItem("apiBaseURLs");
    setApiBaseURLs(defaultAPIBaseURLs);
  };

  return (
    <div>
      <h2>Developer Settings</h2>
      <div className="my-2">
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
      <div className="my-2">
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
    </div>
  );
};

export default DeveloperSettings;