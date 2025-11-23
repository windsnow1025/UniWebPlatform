import React, {useEffect, useState} from "react";
import {Switch, FormControlLabel, Typography, Divider} from "@mui/material";
import APIBaseURLSelect from "./APIBaseURLSelect";
import {StorageKeys} from "../../../lib/common/Constants";

const DeveloperSettings = () => {
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(StorageKeys.DeveloperMode);
    if (stored !== null) {
      setDeveloperMode(stored === 'true');
    }
  }, []);

  const handleToggle = (event) => {
    const checked = !!event.target.checked;
    setDeveloperMode(checked);
    localStorage.setItem(StorageKeys.DeveloperMode, String(checked));
  };

  return (
    <div>
      <Typography variant="h4">Developer Settings</Typography>
      <Divider sx={{my: 2}}/>
      <Typography variant="h5">Developer Mode</Typography>
      <FormControlLabel
        control={<Switch checked={developerMode} onChange={handleToggle} />}
        label="Developer Mode"
      />
      <Divider sx={{my: 2}}/>
      <Typography variant="h5">API Base URL</Typography>
      <APIBaseURLSelect apiType="nest" label="Nest API Base URL"/>
      <APIBaseURLSelect apiType="fastAPI" label="FastAPI API Base URL"/>
    </div>
  );
};

export default DeveloperSettings;