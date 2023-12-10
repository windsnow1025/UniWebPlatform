import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UserCenter from "./page/UserCenter";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-center" element={<UserCenter />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

