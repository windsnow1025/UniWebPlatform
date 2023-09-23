import axios from "axios";
import {marked} from "marked";
import hljs from "highlight.js";
import 'font-awesome/css/font-awesome.min.css';
import '../css/markdown.css';

// Account
import {init} from './auth.js';

await init();

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

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, {language}).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

class Message {
    /**
     * Constructor
     * @param {string} role
     * @param {string} content
     * @param {HTMLElement} message_div
     */
    constructor(role, content, message_div) {
        this.role = role;
        this.content = content;
        /** @type {HTMLElement} */
        this.role_select = message_div.querySelector('select[name="role"]');
        /** @type {HTMLElement} */
        this.content_div = message_div.querySelector('div[name="content"]');
        this.bind();
        this.render();
    }

    parse() {
        let content = this.content;
        content = content.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        content = marked.parse(content);
        this.content_div.innerHTML = content;
        MathJax.typeset([this.content_div]);
    }

    render(parse = true) {
        this.role_select.value = this.role;
        this.content_div.innerHTML = this.content;
        if (parse) {
            this.parse();
        }
    }

    bind() {
        // On role change, update role value
        this.role_select.addEventListener("change", function () {
            this.role = this.role_select.value;
        }.bind(this));

        // On content blur, update content value
        this.content_div.addEventListener("blur", function () {
            this.content = this.content_div.innerHTML;
            this.render();
        }.bind(this));

        // On content focus, show unparsed content
        this.content_div.addEventListener("focus", function () {
            this.content_div.innerHTML = this.content;
        }.bind(this));
    }
}

class GPT {
    constructor() {
        /** @type {Array} */
        this.conversations = [];
        /** @type {Message[]} */
        this.messages = [];
        /** @type {HTMLElement} */
        this.status = document.getElementById("status");
        /** @type {boolean[]} */
        this.wait_response = [];
        /** @type {AbortController} */
        this.controller = null;
        /** @type {string} */
        this.token = localStorage.getItem('token');
        this.clear_message_divs();
        const system_content = this.getSystemContent();
        this.add(0, "system", system_content);
        this.add(1);
        this.fetch_display_conversations();
    }

    getSystemContent() {
        const date = new Date();
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-based in JavaScript
        const day = ("0" + date.getDate()).slice(-2);
        const currentDate = `${year}-${month}-${day}`;
        return "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.\n" +
            "Knowledge cutoff: 2022-01\n" +
            "Current date: " + currentDate;
    }

    // Serialize messages[] to JSON
    serializeMessages() {
        return JSON.stringify(this.messages.map(message => {
            return {
                role: message.role,
                content: message.content
            }
        }));
    }

    // Create and render message_div[] from messages[]
    clear_message_divs() {
        // Clear messages_div
        const messages_div = document.querySelector("#messages_div");
        messages_div.innerHTML = "";

        // Create and render
        // Add Button
        const add_button_div_template = document.querySelector('div[name="add_button_div"]');
        const add_button_div = add_button_div_template.cloneNode(true);
        const add_button = add_button_div.querySelector('i[name="add_button"]');
        messages_div.appendChild(add_button_div);
        add_button.onclick = function () {
            this.add(0);
        }.bind(this);
    }

    // Create and render message_div[index] from messages[index]
    create_render_message_div(index, message_div) {
        const render_index = index + 1;

        // Copy button
        const copy_button = message_div.querySelector('i[name="copy_button"]');
        copy_button.onclick = function () {
            // -1 for the add button
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.copy(currentIndex);
        }.bind(this);

        // Delete button
        const delete_button = message_div.querySelector('i[name="delete_button"]');
        delete_button.onclick = function () {
            // -1 for the add button
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.delete(currentIndex);
        }.bind(this);

        // Add Button
        const add_button = message_div.querySelector('i[name="add_button"]');
        add_button.onclick = function () {
            // -1 for the add button
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.add(currentIndex + 1);
        }.bind(this);

        // Insert the new message div to the messages div
        const messages_div = document.querySelector("#messages_div");
        messages_div.insertBefore(message_div, messages_div.childNodes[render_index]);
    }

    // Render message_div[index] from messages[index]
    render_message_div(index, parse = true) {
        const message = this.messages[index];

        if (message.content_div == document.activeElement || parse == false) {
            message.render(false);
        } else {
            message.render(parse);
        }
    }

    // Generate Response
    async generate() {
        // If not logged in, return
        this.token = localStorage.getItem('token');
        if (!this.token) {
            alert("Please sign in first.");
            return;
        }

        // Set status to generating
        this.status.innerHTML = "Generating...";
        document.getElementById("generate").innerHTML = "Stop";

        // Set streaming status
        this.wait_response.push(true);
        const stream_index = this.wait_response.length - 1;

        // Get parameters
        const messages = this.serializeMessages();
        const api_type = document.getElementById("api_type").value;
        const model = document.getElementById("model").value;
        const temperature = document.getElementById("temperature").value;
        const stream = document.getElementById("stream").checked;

        // Create a new form data object
        const formData = new FormData();
        formData.append("messages", messages);
        formData.append("api_type", api_type);
        formData.append("model", model);
        formData.append("temperature", temperature);
        formData.append("stream", stream);

        // Stream mode off
        if (!stream) {
            try {
                const res = await axios.post("/api/gpt/", formData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                // Stop if not waiting for response
                if (!this.wait_response[stream_index]) {
                    return;
                }

                // Get the response
                let content = res.data;
                content = content.replace("<", "&lt;").replace(">", "&gt;");

                // Update the last message div
                this.add(this.messages.length, "assistant", content, true);

                // Add a new message div
                this.add(this.messages.length);

                // Set status
                this.status.innerHTML = "Ready";
                document.getElementById("generate").innerHTML = "Generate";
            } catch (err) {
                this.status.innerHTML = err;
                document.getElementById("generate").innerHTML = "Generate";
            }
        }

        async function processChunk(reader, controller) {
            const {done, value} = await reader.read();
            if (done) {
                controller.close();
                return;
            }

            // Process the chunk
            let chunk = new TextDecoder("utf-8").decode(value);
            chunk = chunk.replace("<", "&lt;").replace(">", "&gt;");

            // Update messages array
            gpt.messages[gpt.messages.length - 1].content += chunk;

            // Append the chunk to the message div
            const message = gpt.messages[gpt.messages.length - 1];
            message.content_div.innerHTML += chunk;

            await processChunk(reader, controller);
        }

        // Stream mode on
        if (stream) {
            this.controller = new AbortController();
            try {
                const response = await fetch("/api/gpt/", {
                    method: "POST",
                    body: formData,
                    signal: this.controller.signal,
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                const reader = response.body.getReader();
                const processedStream = new ReadableStream({
                    async start(controller) {
                        gpt.add(gpt.messages.length, "assistant", "", true);
                        await processChunk(reader, controller);
                    },
                }, {signal: this.controller.signal});

                await processedStream.getReader().read();

                // Set status
                this.status.innerHTML = "Ready";
                document.getElementById("generate").innerHTML = "Generate";

                // Render the last message div
                this.render_message_div(this.messages.length - 1);

                // Add a new message div
                this.add(this.messages.length);
            } catch (error) {
                this.status.innerHTML = error;
                document.getElementById("generate").innerHTML = "Generate";
            }
        }

        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Stop generating response
    stop() {
        // Set last wait_response status to false
        this.wait_response[this.wait_response.length - 1] = false;

        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status.innerHTML = "Ready";
        document.getElementById("generate").innerHTML = "Generate";
    }

    // Focus on the content of message at index
    focus(index) {
        const message = document.getElementById("messages_div").childNodes[index + 1]; // +1 for the add button
        message.querySelector('div[name="content"]').focus();
    }

    // Add a new message at index
    add(index, role = "user", content = "", generating = false) {
        // Abort controller
        if (this.controller && !generating) {
            this.controller.abort();
        }

        // Set status to ready
        if (!generating) {
            this.status.innerHTML = "Ready";
            document.getElementById("generate").innerHTML = "Generate";
        }

        // Get the template message div and clone it
        const template_message_div = document.querySelector('div[name="message_div"]');
        const message_div = template_message_div.cloneNode(true);

        // Create and render the new message div at index
        const message = new Message(role, content, message_div);
        this.messages.splice(index, 0, message);
        this.create_render_message_div(index, message_div);

        // Re-render the messages div from index + 1
        for (let i = index + 1; i < this.messages.length; i++) {
            this.render_message_div(i);
        }

        // Focus on the new message div
        if (!generating) {
            this.focus(index);
        }
    }

    // Delete the message at index
    delete(index) {
        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status.innerHTML = "Ready";
        document.getElementById("generate").innerHTML = "Generate";

        // Delete the message at index
        this.messages.splice(index, 1);
        const messages_div = document.getElementById("messages_div");
        messages_div.removeChild(messages_div.childNodes[index + 1]); // +1 for the add button
    }

    // Copy to clipboard
    copy(index) {
        // Get message content
        const content = this.messages[index].content;

        // Copy to clipboard
        navigator.clipboard.writeText(content);
    }

    // Save the messages array as a JSON file
    download() {
        const fileName = 'messages.json';
        const data = this.serializeMessages();
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // Load the messages array from a JSON file
    upload() {
        // Request a JSON file from the user
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            // Get the file
            const file = e.target.files[0];

            // Read the file
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;

                // Parse the JSON file
                const messages = JSON.parse(content);

                this.clear_message_divs();
                this.messages = [];
                for (let i = 0; i < messages.length; i++) {
                    this.add(i, messages[i].role, messages[i].content);
                }
            }
        }
        input.click();

        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }

    async fetch_conversations() {
        try {
            const res = await axios.get('/api/conversation/', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            this.conversations = res.data;
        } catch (err) {
            throw err;
        }
    }

    async fetch_display_conversations() {
        // Fetch conversations
        try {
            await this.fetch_conversations();
            this.status.innerHTML = "Conversations loaded.";
        } catch (err) {
            this.status.innerHTML = "Error loading conversations.";
            return;
        }

        // Clear conversations options
        const conversationsSelect = document.getElementById("conversations");
        conversationsSelect.innerHTML = "";

        // Add options
        for (let i = 0; i < this.conversations.length; i++) {
            const option = document.createElement("option");
            option.value = this.conversations[i]["name"];
            option.text = this.conversations[i]["name"];
            conversationsSelect.appendChild(option);
        }
    }

    async cloudUpload() {
        // Set status to uploading
        this.status.innerHTML = "Uploading";

        // Get name and conversation
        const name = document.getElementById("conversation-name").value;
        const conversation = this.serializeMessages();
        const data = {
            name: name,
            conversation: conversation
        };

        // Upload to cloud
        await axios.post("/api/conversation/", {
            data: data
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        // Set status to uploaded
        this.status.innerHTML = "Uploaded";

        // Fetch conversations
        await this.fetch_display_conversations();

    }

    async cloudUpdate() {
        // Set status to updating
        this.status.innerHTML = "Updating";

        // Get the selected conversation index
        const index = document.getElementById("conversations").selectedIndex;

        // Get name and conversation
        const name = document.getElementById("conversation-name").value;
        const conversation = this.serializeMessages();
        const id = this.conversations[index].id;
        const data = {
            name: name,
            conversation: conversation,
            id: id
        };

        // Update to cloud
        await axios.put(`/api/conversation/`, {
            data: data
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        // Set status to updated
        this.status.innerHTML = "Updated";

        // Fetch conversations
        await this.fetch_display_conversations();
    }

    cloudDownload() {
        // Get the selected conversation index
        const index = document.getElementById("conversations").selectedIndex;

        // Get the conversation
        const messages = JSON.parse(this.conversations[index].conversation);

        // Set the conversation name
        document.getElementById("conversation-name").value = this.conversations[index].name;

        // Re-render the messages div
        this.clear_message_divs();
        this.messages = [];
        for (let i = 0; i < messages.length; i++) {
            this.add(i, messages[i].role, messages[i].content);
        }

    }

    async cloudDelete() {
        // Set status to deleting
        this.status.innerHTML = "Deleting";

        // Get the selected conversation index
        const index = document.getElementById("conversations").selectedIndex;

        // Delete from cloud
        await axios.delete(`/api/conversation/${this.conversations[index].id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        // Set status to deleted
        this.status.innerHTML = "Deleted";

        // Fetch conversations
        await this.fetch_display_conversations();
    }
}

const gpt = new GPT();

// Get buttons
const generateButton = document.getElementById("generate");
const downloadButton = document.getElementById("download");
const uploadButton = document.getElementById("upload");
const CloudUploadButton = document.getElementById("cloud-upload");
const CloudUpdateButton = document.getElementById("cloud-update");
const CloudDownloadButton = document.getElementById("cloud-download");
const CloudDeleteButton = document.getElementById("cloud-delete");

// Bind buttons
generateButton.onclick = function () {
    // Switch between generate and stop
    if (generateButton.innerHTML === "Stop") {
        gpt.stop();
    } else {
        gpt.generate();
    }
}
downloadButton.onclick = gpt.download.bind(gpt);
uploadButton.onclick = gpt.upload.bind(gpt);
CloudUploadButton.onclick = gpt.cloudUpload.bind(gpt);
CloudUpdateButton.onclick = gpt.cloudUpdate.bind(gpt);
CloudDownloadButton.onclick = gpt.cloudDownload.bind(gpt);
CloudDeleteButton.onclick = gpt.cloudDelete.bind(gpt);

// Bind Ctrl+Enter to generate
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        document.activeElement.blur();
        generateButton.click();
    }
});

// Temperature slider
const temperatureInput = document.getElementById('temperature');
const temperatureValue = document.getElementById('temperature-value');

temperatureInput.addEventListener('input', () => {
    temperatureValue.textContent = temperatureInput.value;
});

// Update model options when api_type changes
const apiTypeSelect = document.getElementById("api_type");
apiTypeSelect.addEventListener("change", updateModelOptions);

function updateModelOptions() {
    const apiTypeSelect = document.getElementById("api_type");
    const modelSelect = document.getElementById("model");

    // Clear existing options
    modelSelect.innerHTML = "";

    // Get the selected api_type value
    const selectedApiType = apiTypeSelect.value;

    // Add options based on the selected api_type
    const open_ai_models = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-16k-0613", "gpt-4", "gpt-4-0314", "gpt-4-0613"];
    const azure_models = ["gpt-35-turbo", "gpt-35-turbo-16k", "gpt-4", "gpt-4-32k"];
    if (selectedApiType === "open_ai") {
        for (let i = 0; i < open_ai_models.length; i++) {
            addOption(modelSelect, open_ai_models[i], open_ai_models[i]);
        }
    } else if (selectedApiType === "azure") {
        for (let i = 0; i < azure_models.length; i++) {
            addOption(modelSelect, azure_models[i], azure_models[i]);
        }
    }
}

function addOption(selectElement, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.text = text;
    selectElement.appendChild(option);
}

// Editable checkbox
const editableCheckbox = document.getElementById("editable");
editableCheckbox.addEventListener("change", function () {
    const messagesDiv = document.getElementById("messages_div");
    const messages = messagesDiv.querySelectorAll('div[name="message_div"]');
    for (let i = 0; i < messages.length; i++) {
        const content = messages[i].querySelector('div[name="content"]');
        if (editableCheckbox.checked) {
            content.setAttribute("contenteditable", "plaintext-only");
        } else {
            content.setAttribute("contenteditable", "false");
        }
    }
});

import ConversationsSelectApp from './ConversationsSelectApp.js';

const select_div = ReactDOM.createRoot(document.getElementById('select'));
select_div.render(
    <React.StrictMode>
        <ConversationsSelectApp />
    </React.StrictMode>
);