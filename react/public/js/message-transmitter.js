import axios from "axios";

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from './ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);

class MessageTransmitter {
    constructor() {
        this.sendText = document.getElementById("sendText");
        this.sendTextValue = null;
        this.receiveText = document.getElementById("receiveText");
        this.receiveMessage();
    }
    
    async sendMessage() {
        this.sendTextValue = this.sendText.innerHTML;
        if (this.sendTextValue == "") {
            console.log("Empty message.");
            return;
        }
        await axios.post("/api/message", {
            data: { message: this.sendTextValue }
        }).catch(err => {
            console.error(err);
        })
        this.sendText.innerHTML = "";
        this.receiveMessage();
    }

    async receiveMessage() {
        await axios.get("/api/message").then(res => {
            this.receiveText.innerHTML = "";
            for (let i = 0; i < res.data.length; i++) {
                this.receiveText.innerHTML += res.data[i].message + "<br>";
            }
        }).catch(err => {
            console.error(err);
        })
    }

    async clearReceiveMessage() {
        await axios.delete("/api/message").then(res => {
            this.receiveText.innerHTML = "";
        }).catch(err => {
            console.error(err);
        })
    }
}

const messageTransmitter = new MessageTransmitter();

const sendButton = document.getElementById("send");
const receiveButton = document.getElementById("receive");
const clearReceiveButton = document.getElementById("clearReceive");

sendButton.onclick = messageTransmitter.sendMessage.bind(messageTransmitter);
receiveButton.onclick = messageTransmitter.receiveMessage.bind(messageTransmitter);
clearReceiveButton.onclick = messageTransmitter.clearReceiveMessage.bind(messageTransmitter);

// Bind Ctrl+Enter to generate
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        sendButton.click();
    }
});