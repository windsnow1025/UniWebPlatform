import React, {useEffect, useState} from 'react';
import UserLogic from '../../lib/common/user/UserLogic';
import ConfirmDialog from './ConfirmDialog';
import {useRouter} from "next/router";
import {usePathname} from "next/navigation";
import {useSession} from "@toolpad/core";

const EmailVerificationDialog = () => {
  const session = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [openDialog, setOpenDialog] = useState(false);
  const userLogic = new UserLogic();

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
      } catch (error) {
        console.error('Error checking email verification:', error);
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
    <ConfirmDialog
      open={openDialog}
      onClose={handleDialogClose}
      title="Email Verification Required"
      content="Your email address has not been verified. Please go to settings to verify your email address."
    />
  );
};

export default EmailVerificationDialog;