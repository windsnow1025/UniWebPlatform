import React, {memo, useEffect, useState} from 'react';
import {CircularProgress, Typography} from "@mui/material";
import UserLogic from "../../../../../lib/common/user/UserLogic";

function CreditSection({ refreshKey = 0 }) {
  const userLogic = new UserLogic();

  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const fetchCredit = async () => {
      const token = localStorage.getItem('token');
      setSignedIn(!!token);
      if (token) {
        const credit = await userLogic.fetchCredit();
        setCredit(credit);
      }
      setLoading(false);
    };

    fetchCredit();
  }, [refreshKey]);

  if (loading) {
    return <CircularProgress/>;
  }

  if (!signedIn) {
    return <Typography>Sign in to view credits</Typography>;
  }

  return <Typography>Credit: {credit}</Typography>;
}

export default CreditSection;
