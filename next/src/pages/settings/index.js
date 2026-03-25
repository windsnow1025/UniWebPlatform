import React, {useEffect, useMemo, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import AuthSettings from "@/components/common/settings/auth/AuthSettings";
import DeveloperSettings from "@/components/common/settings/DeveloperSettings";
import AdminSetting from "@/components/common/settings/AdminSetting";
import UserLogic from "@/lib/common/user/UserLogic";
import StorageSettings from "@/components/common/settings/StorageSettings";
import Head from "next/head";
import {useRouter} from "next/router";

const Settings = () => {
  const userLogic = useMemo(() => new UserLogic(), []);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(() => {
    const tab = Number(router.query.tab);
    return isNaN(tab) ? 0 : tab;
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await userLogic.isAdmin();
      setIsAdmin(adminStatus);
    };

    checkAdmin();
  }, [userLogic]);

  useEffect(() => {
    const tab = Number(router.query.tab);
    setActiveTab(isNaN(tab) ? 0 : tab);
  }, [router.query.tab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    router.replace({ query: { ...router.query, tab: newValue } }, undefined, { shallow: true });
  };

  return (
    <div className="local-scroll-container">
      <Head>
        <title>Settings</title>
      </Head>
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