import React from 'react';
import ReactDOM from 'react-dom/client';
import './asset/css/index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from './App';
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UserCenter from "./page/UserCenter";
import MarkdownUpdate from "./page/MarkdownUpdate";
import MarkdownAdd from "./page/MarkdownAdd";
import Bookmark from "./page/Bookmark";
import MarkdownViewer from "./page/MarkdownViewer";
import MessageTransmitter from "./page/MessageTransmitter";
import GPT from "./page/GPT";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/user-center" element={<UserCenter/>}/>
      <Route path="/markdown/update/:id" element={<MarkdownUpdate/>}/>
      <Route path="/markdown/add" element={<MarkdownAdd/>}/>
      <Route path="/bookmark" element={<Bookmark/>}/>
      <Route path="/markdown/view/:filename" element={<MarkdownViewer/>}/>
      <Route path="/message" element={<MessageTransmitter/>}/>
      <Route path="/gpt" element={<GPT/>}/>
    </Routes>
  </BrowserRouter>
);

