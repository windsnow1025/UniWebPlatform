import React, {useEffect, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import AuthSettings from "../../app/components/common/settings/auth/AuthSettings";
import DeveloperSettings from "../../app/components/common/settings/DeveloperSettings";
import AdminSetting from "../../app/components/common/settings/AdminSetting";
import UserLogic from "../../src/common/user/UserLogic";
import StorageSettings from "../../app/components/common/settings/StorageSettings";

const Settings = () => {
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
    <div className="local-scroll-container">
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Auth"/>
        <Tab label="Storage"/>
        <Tab label="Developer"/>
        {isAdmin && <Tab label="Admin"/>}
      </Tabs>
      <div className="local-scroll-scrollable p-4">
        {activeTab === 0 && <AuthSettings/>}
        {activeTab === 1 && <StorageSettings/>}
        {activeTab === 2 && <DeveloperSettings/>}
        {isAdmin && activeTab === 3 && <AdminSetting/>}
      </div>
    </div>
  );
};

export default Settings;