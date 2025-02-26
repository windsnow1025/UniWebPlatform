import React, { useState } from "react";
import { Button } from "@mui/material";
import AccountDiv from "../../user/AccountDiv";
import ConfirmDialog from "../../ConfirmDialog";
import UserLogic from "../../../../../src/common/user/UserLogic";

const SignedInView = ({ onSignOut, onAccountDeleted }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userLogic = new UserLogic();

  const handleDeleteAccount = async (confirmed) => {
    setConfirmDialogOpen(false);

    if (confirmed) {
      try {
        setLoading(true);
        await userLogic.deleteUser();
        localStorage.removeItem("token");
        onAccountDeleted();
      } catch (error) {
        console.error("Failed to delete account:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <AccountDiv />
      <div className="flex m-2 gap-2 justify-end">
        <Button
          variant="contained"
          color="error"
          onClick={() => setConfirmDialogOpen(true)}
          disabled={loading}
        >
          Delete Account
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onSignOut}
          disabled={loading}
        >
          Sign Out
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleDeleteAccount}
        title="Delete Account"
        content="Are you sure you want to delete your account? This action cannot be undone."
      />
    </div>
  );
};

export default SignedInView;