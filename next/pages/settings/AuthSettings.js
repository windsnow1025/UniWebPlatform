import React, {useEffect, useState} from "react";
import {Alert, Button, CircularProgress, Divider, Snackbar, Typography} from "@mui/material";
import UserLogic from "../../src/common/user/UserLogic";
import AccountDiv from "../../app/components/common/user/AccountDiv";
import SignDiv from "../../app/components/common/user/SignDiv";
import CreditDiv from "../../app/components/common/user/CreditDiv";

const AuthSettings = () => {
  const userLogic = new UserLogic();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true);
      const fetchedUsername = await userLogic.fetchUsername();
      setUsername(fetchedUsername);
      setLoading(false);
    };

    fetchUsername();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUsername("");
    setAlertMessage("Signed out successfully.");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress/>
      ) : username ? (
        <div>
          <AccountDiv/>
          <div className="flex m-2">
            <div className="inflex-fill"></div>
            <Button variant="contained" color="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="h6">You are not signed in.</Typography>
          <SignDiv/>
        </div>
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AuthSettings;