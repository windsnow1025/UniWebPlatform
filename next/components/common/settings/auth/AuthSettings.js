import React, {useEffect, useState} from "react";
import {Alert, Button, CircularProgress, Snackbar, Typography} from "@mui/material";
import UserLogic from "../../../../lib/common/user/UserLogic";
import AccountDiv from "./signed-in/AccountDiv";
import SignDiv from "./signed-out/SignDiv";
import ConfirmDialog from "../../ConfirmDialog";

const AuthSettings = () => {
  const userLogic = new UserLogic();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true);
      const fetchedUsername = await userLogic.fetchUsername();
      setUsername(fetchedUsername);
      setLoading(false);
    };

    fetchUsername();
  }, []);

  const handleDeleteAccount = async (confirmed) => {
    setConfirmDialogOpen(false);

    if (confirmed) {
      try {
        setLoading(true);
        await userLogic.deleteUser();
        localStorage.removeItem("token");
        setUsername("");
        setAlertMessage("Account deleted successfully.");
        setAlertSeverity("success");
        setAlertOpen(true);
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity("error");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <CircularProgress/>
      ) : username ? (
        <div>
          <AccountDiv/>
          <div className="flex m-2 gap-2 justify-end">
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>

          <ConfirmDialog
            open={confirmDialogOpen}
            onClose={handleDeleteAccount}
            title="Delete Account"
            content="Are you sure you want to delete your account? This action cannot be undone."
          />
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