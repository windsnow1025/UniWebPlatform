import React, {useEffect, useState} from "react";
import {Tabs, Tab, CssBaseline} from "@mui/material";
import AuthSettings from "./AuthSettings";
import PersonalizationSettings from "./PersonalizationSettings";
import DeveloperSettings from "./DeveloperSettings";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import {ThemeProvider} from "@mui/material/styles";

const Settings = () => {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Settings";

  useEffect(() => {
    document.title = title;
  }, []);


  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Auth"/>
        <Tab label="Personalization"/>
        <Tab label="Developer"/>
      </Tabs>
      <div className="p-4">
        {activeTab === 0 && <AuthSettings/>}
        {activeTab === 1 && <PersonalizationSettings systemTheme={systemTheme} setSystemTheme={setSystemTheme}/>}
        {activeTab === 2 && <DeveloperSettings/>}
      </div>
    </ThemeProvider>
  );
};

export default Settings;