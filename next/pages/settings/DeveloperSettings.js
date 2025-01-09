import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const DeveloperSettings = () => {
  const [nestAPIBaseURL, setNestAPIBaseURL] = useState("");
  const [fastAPIAPIBaseURL, setFastAPIAPIBaseURL] = useState("");

  const handleSave = () => {
    // TODO
  };

  return (
    <div>
      <h2>Developer Settings</h2>
      <div className="m-2">
        <TextField
          label="Nest API Base URL"
          variant="outlined"
          fullWidth
          value={nestAPIBaseURL}
          onChange={(e) => setNestAPIBaseURL(e.target.value)}
        />
      </div>
      <div className="m-2">
        <TextField
          label="FastAPI API Base URL"
          variant="outlined"
          fullWidth
          value={fastAPIAPIBaseURL}
          onChange={(e) => setFastAPIAPIBaseURL(e.target.value)}
        />
      </div>
      <div className="m-2">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default DeveloperSettings;