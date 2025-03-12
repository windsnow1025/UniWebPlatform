import React, {useEffect, useState} from 'react';
import UserLogic from '../../../src/common/user/UserLogic';
import ConfirmDialog from './ConfirmDialog';
import {useRouter} from "next/router";
import {usePathname} from "next/navigation";

const EmailVerificationDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const userLogic = new UserLogic();

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const username = await userLogic.fetchUsername();

        if (!username) {
          return;
        }

        const isVerified = await userLogic.fetchEmailVerified();

        if (!isVerified) {
          setOpenDialog(true);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkEmailVerification();
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      router.push(`/settings?redirect=${encodeURIComponent(pathname)}`);
    }
  };

  return (
    <ConfirmDialog
      open={openDialog}
      onClose={handleDialogClose}
      title="Email Verification Required"
      content="Your email address has not been verified. Please go to settings to verify your email address."
    />
  );
};

export default EmailVerificationDialog;