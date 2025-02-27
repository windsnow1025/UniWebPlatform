import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserLogic from '../../../../src/common/user/UserLogic';
import ConfirmDialog from '../ConfirmDialog';

const EmailVerificationDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const userLogic = new UserLogic();

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const username = await userLogic.fetchUsername();

        if (username) {
          const isVerified = await userLogic.fetchEmailVerified();

          if (isVerified === false) {
            setOpenDialog(true);
          }
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkEmailVerification();
  }, []);

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      window.open('/settings', '_blank');
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