import React from 'react';
import {Paper, Typography, Divider} from "@mui/material";
import CreditDiv from "./CreditSection";
import UsernameSection from "./UsernameSection";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";

function AccountDiv() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Typography variant="h5" className="mb-4 text-center" gutterBottom>
        Account Settings
      </Typography>

      <div className="flex-center m-2">
        <CreditDiv/>
      </div>

      <div className="mb-6">
        <UsernameSection/>
      </div>

      <div className="my-4">
        <Divider/>
      </div>

      <div className="mb-6">
        <EmailSection/>
      </div>

      <div className="my-4">
        <Divider/>
      </div>

      <div className="mb-2">
        <PasswordSection/>
      </div>
    </div>
  );
}

export default AccountDiv;