import React, {useState} from 'react';
import {
  Typography,
  Paper,
  Grid2 as Grid,
  Tabs,
  Tab,
  Box,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CreditDiv from "./CreditSection";
import UsernameSection from "./UsernameSection";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import AvatarSection from "./AvatarSection";

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}

function AccountDiv() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{borderRadius: 2, overflow: 'hidden'}}>
      <Box sx={{
        p: 3,
        background: theme.palette.primary.main,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5" fontWeight="bold">
          Account Settings
        </Typography>
        <CreditDiv/>
      </Box>

      <Grid container>
        <Grid item sx={{ borderRight: 1, borderColor: 'divider' }}>
          <div className="p-4 flex flex-col items-center">
            <AvatarSection/>
          </div>
          <Divider/>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleTabChange}
            className="border-r border-divider"
          >
            <Tab label="Username" className="text-left pl-6 items-start"/>
            <Tab label="Email" className="text-left pl-6 items-start"/>
            <Tab label="Password" className="text-left pl-6 items-start"/>
          </Tabs>
        </Grid>

        <Grid item>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Update Username
            </Typography>
            <UsernameSection/>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Email Settings
            </Typography>
            <EmailSection/>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <PasswordSection/>
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AccountDiv;