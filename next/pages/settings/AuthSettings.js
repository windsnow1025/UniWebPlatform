import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import UserLogic from "../../src/common/user/UserLogic";
import AccountDiv from "../../app/components/common/user/AccountDiv";

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
      <h2>Authentication Settings</h2>
      {loading ? (
        <CircularProgress />
      ) : username ? (
        <div>
          <Typography variant="h6">Signed in as: {username}</Typography>
          <AccountDiv/>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      ) : (
        <div>
          <Typography variant="h6">You are not signed in.</Typography>
          <div className="mt-2">
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/user/state/signin")}
              className="mb-2"
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => (window.location.href = "/user/state/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthSettings;