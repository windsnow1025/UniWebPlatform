import React, {useEffect, useState} from "react";
import {Tabs, Tab, CssBaseline} from "@mui/material";
import AuthSettings from "./AuthSettings";
import PersonalizationSettings from "./PersonalizationSettings";
import DeveloperSettings from "./DeveloperSettings";
import AdminSetting from "./AdminSetting";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import {ThemeProvider} from "@mui/material/styles";
import UserLogic from "../../src/common/user/UserLogic";

const Settings = () => {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Settings";
  const userLogic = new UserLogic();

  const [activeTab, setActiveTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = title;

    const checkAdmin = async () => {
      const adminStatus = await userLogic.isAdmin();
      setIsAdmin(adminStatus);
    };

    checkAdmin();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Auth"/>
          <Tab label="Personalization"/>
          <Tab label="Developer"/>
          {isAdmin && <Tab label="Admin"/>}
        </Tabs>
        <div className="local-scroll-scrollable p-4">
          {activeTab === 0 && <AuthSettings/>}
          {activeTab === 1 && (
            <PersonalizationSettings
              systemTheme={systemTheme}
              setSystemTheme={setSystemTheme}
            />
          )}
          {activeTab === 2 && <DeveloperSettings/>}
          {isAdmin && activeTab === 3 && <AdminSetting/>}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Settings;