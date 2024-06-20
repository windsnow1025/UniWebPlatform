import React, { useEffect, useState, memo } from 'react';
import { Typography, CircularProgress } from "@mui/material";
import { UserLogic } from "../../../../src/logic/UserLogic";

function CreditDiv({ refreshKey }) {
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
        <CircularProgress />
      ) : (
        <Typography>Credit: {credit}</Typography>
      )}
    </>
  );
}

export default memo(CreditDiv);