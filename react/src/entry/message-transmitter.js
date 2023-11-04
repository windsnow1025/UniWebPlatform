import axios from "axios";
import {MessageController} from "../controller/MessageController";

// Account
import {initAuth, getUsername} from '../manager/AuthManager.js';

await initAuth();

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from '../component/ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);

class MessageTransmitter {
    constructor() {
        this.username = null;
        this.messages = [];
    }

    async send_message(content) {
        await axios.post("/api/message", {
            data: {
                username: this.username,
                content: content
            }
        }).catch(err => {
            console.error(err);
        })
    }

    async fetch_messages() {
        await axios.get("/api/message").then(res => {
            this.messages = res.data;
        }).catch(err => {
            console.error(err);
        })
    }

    async delete_messages() {
        await axios.delete("/api/message").then(res => {
            this.messages = [];
        }).catch(err => {
            console.error(err);
        })
    }
}

function appendMessage(username, content, messages_div) {
    const template_message_div = document.querySelector("[name='message_div']")
    const message_div = template_message_div.cloneNode(true);
    const messageController = new MessageController(username, content, message_div);
    messages_div.appendChild(message_div);
}

function appendMessages(messages, messages_div) {
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        appendMessage(message.username, message.content, messages_div);
    }
}

const messageTransmitter = new MessageTransmitter();

messageTransmitter.username = await getUsername();

const send_text_div = document.getElementById("sendText");
const messages_div = document.getElementById("messages_div");

const send_button = document.getElementById("send");
const receive_button = document.getElementById("receive");
const clear_receive_button = document.getElementById("clearReceive");

await messageTransmitter.fetch_messages();
appendMessages(messageTransmitter.messages, messages_div);

send_button.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    const message = send_text_div.innerHTML;
    await messageTransmitter.send_message(message);
    send_text_div.innerHTML = "";
    messages_div.innerHTML = "";
    await messageTransmitter.fetch_messages();
    appendMessages(messageTransmitter.messages, messages_div);
});

receive_button.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    await messageTransmitter.fetch_messages();
    messages_div.innerHTML = "";
    appendMessages(messageTransmitter.messages, messages_div);
});

clear_receive_button.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    await messageTransmitter.delete_messages();
    messages_div.innerHTML = "";
});

// Bind Ctrl+Enter to send
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        send_button.click();
    }
});