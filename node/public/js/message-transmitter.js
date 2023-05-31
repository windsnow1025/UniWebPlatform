import axios from "axios";

// Theme
import { initializeTheme } from './theme.js';
initializeTheme();

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
        await axios.post("/api/message-api", {
            data: { message: this.sendTextValue }
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        })
        this.sendText.innerHTML = "";
        this.receiveMessage();
    }

    async receiveMessage() {
        await axios.get("/api/message-api").then(res => {
            this.receiveText.innerHTML = "";
            for (let i = 0; i < res.data.length; i++) {
                this.receiveText.innerHTML += res.data[i].message + "<br>";
            }
        }).catch(err => {
            console.error(err);
        })
    }

    async clearReceiveMessage() {
        await axios.delete("/api/message-api").then(res => {
            this.receiveText.innerHTML = "";
        }).catch(err => {
            console.error(err);
        })
    }
}

var messageTransmitter = new MessageTransmitter();

var sendButton = document.getElementById("send");
var receiveButton = document.getElementById("receive");
var clearReceiveButton = document.getElementById("clearReceive");

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