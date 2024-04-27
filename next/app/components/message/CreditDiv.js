import React, {useEffect, useState} from 'react';
import UserService from "../../../src/service/UserService";

function CreditDiv({ refreshKey }) {
  const userService = new UserService();

  const [credit, setCredit] = useState(0);

  useEffect(() => {
    const fetchCredit = async () => {
      if (localStorage.getItem('token')) {
        const credit = await userService.fetchCredit();
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