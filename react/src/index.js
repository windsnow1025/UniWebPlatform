import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './asset/css/index.css';
import {useInit} from "./useInit";

import App from './page/App';
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UserCenter from "./page/UserCenter";
import MarkdownUpdate from "./page/MarkdownUpdate";
import MarkdownAdd from "./page/MarkdownAdd";
import Bookmark from "./page/Bookmark";
import MarkdownViewer from "./page/MarkdownViewer";
import MessageTransmitter from "./page/MessageTransmitter";
import GPT from "./page/GPT";

function RootApp() {
  const isInitialized = useInit();

  if (!isInitialized) {
    return <div>loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-center" element={<UserCenter />} />
        <Route path="/markdown/update/:id" element={<MarkdownUpdate />} />
        <Route path="/markdown/add" element={<MarkdownAdd />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/markdown/view/:filename" element={<MarkdownViewer />} />
        <Route path="/message" element={<MessageTransmitter />} />
        <Route path="/gpt" element={<GPT />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

