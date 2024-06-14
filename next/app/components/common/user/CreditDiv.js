import React, {useEffect, useState} from 'react';
import {UserLogic} from "../../../../src/logic/UserLogic";
import {Typography} from "@mui/material";

function CreditDiv({ refreshKey }) {
  const userLogic = new UserLogic();

  const [credit, setCredit] = useState(0);

  useEffect(() => {
    const fetchCredit = async () => {
      if (localStorage.getItem('token')) {
        const credit = await userLogic.fetchCredit();
        setCredit(credit);
      }
    };

    fetchCredit();
  }, [refreshKey]);

  return (
    <Typography>Credit: {credit}</Typography>
  );
}

export default CreditDiv;