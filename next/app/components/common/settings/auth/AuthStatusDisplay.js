import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import SignedInView from "./SignedInView";
import SignedOutView from "./SignedOutView";
import UserLogic from "../../../../../src/common/user/UserLogic";

const AuthStatusDisplay = ({ showAlert }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const userLogic = new UserLogic();

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
    showAlert("Signed out successfully.", "success");
  };

  const handleAccountDeleted = () => {
    setUsername("");
    showAlert("Account deleted successfully.", "success");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return username ? (
    <SignedInView
      onSignOut={handleSignOut}
      onAccountDeleted={handleAccountDeleted}
    />
  ) : (
    <SignedOutView />
  );
};

export default AuthStatusDisplay;