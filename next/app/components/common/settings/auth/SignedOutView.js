import React from "react";
import { Typography } from "@mui/material";
import SignDiv from "../../user/SignDiv";

const SignedOutView = () => {
  return (
    <div>
      <Typography variant="h6">You are not signed in.</Typography>
      <SignDiv />
    </div>
  );
};

export default SignedOutView;