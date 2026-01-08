import React from 'react';
import {Paper, Typography} from "@mui/material";
import Head from "next/head";

function Purchase() {
  return (
    <div className="local-scroll-container">
      <Head>
        <title>Purchase Credit - Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable flex-center">
        <Paper elevation={3} className="p-6">
          <Typography variant="h5" gutterBottom>
            Purchase Credit
          </Typography>
          <Typography>
            Please contact{' '}
            <a href="mailto:windsnow1025@gmail.com">windsnow1025@gmail.com</a>
            {' '}to purchase credits.
          </Typography>
        </Paper>
      </div>
    </div>
  );
}

export default Purchase;
