import axios from "axios";

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from './components/ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);

class MessageTransmitter {
    constructor() {
        this.messages = [];
    }

    async send_message(message) {
        await axios.post("/api/message", {
            data: { message: message }
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

const messageTransmitter = new MessageTransmitter();

const send_text_div = document.getElementById("sendText");
const receive_text_div = document.getElementById("receiveText");

const send_button = document.getElementById("send");
const receiveButton = document.getElementById("receive");
const clearReceiveButton = document.getElementById("clearReceive");

await messageTransmitter.fetch_messages();
for (let i = 0; i < messageTransmitter.messages.length; i++) {
    receive_text_div.innerHTML += messageTransmitter.messages[i].message + "<br>";
}

send_button.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    const message = send_text_div.innerHTML;
    await messageTransmitter.send_message(message);
    send_text_div.innerHTML = "";
    receive_text_div.innerHTML = "";
    await messageTransmitter.fetch_messages();
    for (let i = 0; i < messageTransmitter.messages.length; i++) {
        receive_text_div.innerHTML += messageTransmitter.messages[i].message + "<br>";
    }
});

receiveButton.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    await messageTransmitter.fetch_messages();
    receive_text_div.innerHTML = "";
    for (let i = 0; i < messageTransmitter.messages.length; i++) {
        receive_text_div.innerHTML += messageTransmitter.messages[i].message + "<br>";
    }
});

clearReceiveButton.addEventListener('click', async function (event) {
    event.preventDefault(); // prevent the default action
    await messageTransmitter.delete_messages();
    receive_text_div.innerHTML = "";
});

// Bind Ctrl+Enter to send
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        send_button.click();
    }
});