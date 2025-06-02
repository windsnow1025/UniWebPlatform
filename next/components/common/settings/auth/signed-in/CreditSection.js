import React, {memo, useEffect, useState} from 'react';
import {CircularProgress, Typography} from "@mui/material";
import UserLogic from "../../../../../lib/common/user/UserLogic";

function CreditSection({ refreshKey = 0 }) {
  const userLogic = new UserLogic();

  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredit = async () => {
      if (localStorage.getItem('token')) {
        setLoading(true);
        const credit = await userLogic.fetchCredit();
        setCredit(credit);
        setLoading(false);
      }
    };

    fetchCredit();
  }, [refreshKey]);

  return (
    <>
      {loading ? (
        <CircularProgress/>
      ) : (
        <Typography>Credit: {credit}</Typography>
      )}
    </>
  );
}

export default CreditSection;
