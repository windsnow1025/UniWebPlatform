import React from "react";
import {Divider, Typography} from "@mui/material";
import APIBaseURLSelect from "./APIBaseURLSelect";

const DeveloperSettings = () => {
  return (
    <div>
      <Typography variant="h4">Developer Settings</Typography>
      {/*<br></br>*/}
      {/*<Typography variant="h5">Developer Mode</Typography>*/}
      <br></br>
      <Typography variant="h5">API Base URL</Typography>
      <APIBaseURLSelect apiType="nest" label="Nest API Base URL"/>
      {/*<Divider/>*/}
      <APIBaseURLSelect apiType="fastAPI" label="FastAPI API Base URL"/>
    </div>
  );
};

export default DeveloperSettings;