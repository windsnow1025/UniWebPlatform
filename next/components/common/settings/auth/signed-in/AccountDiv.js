import React, {useState} from 'react';
import Link from "next/link";
import {Box, Divider, Grid, Paper, Tab, Tabs, Typography, useTheme,} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import CreditSection from "./CreditSection";
import UsernameSection from "./UsernameSection";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import AvatarSection from "./AvatarSection";

function AccountDiv() {
  const [tabValue, setTabValue] = useState('0');
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{borderRadius: 2, overflow: 'hidden'}}>
      <Box sx={{
        p: 3,
        background: `color-mix(in srgb, ${theme.vars.palette.primary.main}, black 25%)`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5" fontWeight="bold">
          Account Settings
        </Typography>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <CreditSection/>
          <Link href="/pricing/pricing" target="_blank" style={{color: 'white'}}>
            Pricing
          </Link>
          <Link href="/pricing/purchase" target="_blank" style={{color: 'white'}}>
            Purchase Credit
          </Link>
        </Box>
      </Box>

      <TabContext value={tabValue}>
        <Grid container>
          <Grid sx={{borderRight: 1, borderColor: 'divider'}}>
            <div className="p-4 flex flex-col items-center">
              <AvatarSection/>
            </div>
            <Divider/>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={handleTabChange}
            >
              <Tab label="Email" value="0"/>
              <Tab label="Username" value="1"/>
              <Tab label="Password" value="2"/>
            </Tabs>
          </Grid>

          <Grid>
            <TabPanel value="0">
              <Typography variant="h6" gutterBottom>
                Email Settings
              </Typography>
              <EmailSection/>
            </TabPanel>
            <TabPanel value="1">
              <Typography variant="h6" gutterBottom>
                Update Username
              </Typography>
              <UsernameSection/>
            </TabPanel>
            <TabPanel value="2">
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <PasswordSection/>
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </Paper>
  );
}

export default AccountDiv;
