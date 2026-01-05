import React, {useEffect, useState} from 'react';
import UserLogic from '../../lib/common/user/UserLogic';
import ConfirmDialog from './ConfirmDialog';
import {useRouter} from "next/router";
import {usePathname} from "next/navigation";
import {useSession} from "@toolpad/core";
import {Alert, Snackbar} from "@mui/material";

const EmailVerificationDialog = () => {
  const session = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [openDialog, setOpenDialog] = useState(false);
  const userLogic = new UserLogic();

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!session?.user) {
        setOpenDialog(false);
        return;
      }

      if (pathname && pathname.startsWith('/settings')) {
        setOpenDialog(false);
        return;
      }
      try {
        if (await userLogic.fetchEmailVerified()) {
          setOpenDialog(false);
          return;
        }

        setOpenDialog(true);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    };

    checkEmailVerification();
  }, [session, pathname]);

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      router.push(`/settings?redirect=${encodeURIComponent(pathname)}`);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={openDialog}
        onClose={handleDialogClose}
        title="Email Verification Required"
        content="Your email address has not been verified. Please go to settings to verify your email address."
        disableBackdropClose
      />

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmailVerificationDialog;