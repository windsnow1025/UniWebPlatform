import React, {useEffect, useState} from 'react';
import {UserLogic} from "../../../src/logic/UserLogic";

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
    <div>Credit: {credit}</div>
  );
}

export default CreditDiv;