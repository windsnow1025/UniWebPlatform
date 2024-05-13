import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {Button, CssBaseline} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import {DdnsLogic} from "../src/logic/DdnsLogic";

function DDNS() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Cloudflare DDNS";
  }, []);

  const [cloudflareEmail, setCloudflareEmail] = useState();
  const [cloudflareApiKey, setCloudflareApiKey] = useState();
  const [dnsRecordName, setDnsRecordName] = useState();

  const handleDdnsUpdate = () => {
    const ddns = new DdnsLogic(cloudflareEmail, cloudflareApiKey);
    ddns.getDomainId();
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <HeaderAppBar
        title="Password Generator"
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <div className="flex-center">
        <div className="text-center">
          <div className="m-2">
            <TextField
              label="Cloudflare Email"
              variant="outlined"
              type="text"
              value={cloudflareEmail}
              onChange={(e) => setCloudflareEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="m-2">
            <TextField
              label="Global API Key"
              variant="outlined"
              type="text"
              value={cloudflareApiKey}
              onChange={(e) => setCloudflareApiKey(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="m-2">
            <TextField
              label="DNS Record Name"
              variant="outlined"
              type="text"
              value={dnsRecordName}
              onChange={(e) => setDnsRecordName(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="m-2">
            <Button id="generate" variant="contained" onClick={handleDdnsUpdate}>Confirm</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default DDNS;
