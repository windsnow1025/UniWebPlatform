import React, {useEffect, useState} from "react";
import {Button, CircularProgress, Divider, Typography} from "@mui/material";
import UserLogic from "../../src/common/user/UserLogic";
import AccountDiv from "../../app/components/common/user/AccountDiv";
import SignDiv from "../../app/components/common/user/SignDiv";
import CreditDiv from "../../app/components/common/user/CreditDiv";

const AuthSettings = () => {
  const userLogic = new UserLogic();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
    alert("You have been signed out.");
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
    </div>
  );
};

export default AuthSettings;