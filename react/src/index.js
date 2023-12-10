import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from './App';
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UserCenter from "./page/UserCenter";
import MarkdownUpdate from "./page/MarkdownUpdate";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-center" element={<UserCenter />} />
        <Route path="/markdown/update/:id" element={<MarkdownUpdate />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

