import React, {useEffect, useState} from 'react';
import UserLogic from "../../../../../lib/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import {Alert, Button, Snackbar, Typography} from "@mui/material";
import {wait} from "../../../utils/Wait";
import {useRouter} from "next/router";

function EmailSection() {
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userLogic.fetchUser();
        if (user) {
          setEmail(user.email);
          setEmailVerified(user.emailVerified);
          setNewEmail(user.email);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleUpdateEmail = async () => {
    if (!userLogic.validateEmail(newEmail)) {
      showAlert("Please enter a valid email address.", 'warning');
      return;
    }

    try {
      setIsSendingVerification(true);

      await userLogic.updateEmail(newEmail);
      await userLogic.sendEmailVerification(newEmail);

      setEmailVerificationSent(true);
      setResendCooldown(60);
      showAlert("Verification email sent to " + newEmail + ". Please verify your email to complete the update.", 'info');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      showAlert(`Please wait ${resendCooldown} seconds before requesting another email.`, 'warning');
      return;
    }

    try {
      setIsSendingVerification(true);
      await userLogic.sendEmailVerification(newEmail);
      setResendCooldown(60);
      showAlert("Verification email resent. Please check your inbox.", 'info');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const router = useRouter();

  const handleCheckVerification = async () => {
    try {
      setIsCheckingVerification(true);
      await userLogic.updateEmailVerification();
      setEmailVerificationSent(false);
      showAlert("Email verification success. Redirecting...", 'success');

      // Redirect
      let redirectUrl = router.query.redirect;
      await wait(1);
      if (!redirectUrl || !redirectUrl.startsWith('/')) {
        redirectUrl = '/';
      }
      router.push(redirectUrl);
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const isProcessing = isSendingVerification || isCheckingVerification;

  return (
    <div className="flex flex-col gap-2">
      {emailVerificationSent ? (
        <>
          <Typography variant="body1" align="center" gutterBottom>
            Verification email sent to {newEmail}
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Please check your inbox and verify your email to complete the update.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCheckVerification}
            size="medium"
            fullWidth
            disabled={isProcessing}
          >
            {isCheckingVerification ? "Checking..." : "I've Verified My Email"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleResendVerification}
            size="medium"
            fullWidth
            disabled={isProcessing || resendCooldown > 0}
          >
            {resendCooldown > 0
              ? `Resend Available in ${resendCooldown}s`
              : "Resend Verification Email"}
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="New Email"
            variant="outlined"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={isProcessing}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateEmail}
            fullWidth
            disabled={isProcessing || (email === newEmail && emailVerified)}
          >
            {isSendingVerification ? "Sending Verification..." : (emailVerified ? "Update Email" : "Verify Email")}
          </Button>
        </>
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
}

export default EmailSection;