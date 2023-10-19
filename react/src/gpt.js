import {marked} from "marked";
import hljs from "highlight.js";
import 'font-awesome/css/font-awesome.min.css';
import '/public/css/markdown.css';

// Account
import {initAuth} from './auth.js';

await initAuth();

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

import {Conversation} from './class/conversation.js';

// Get elements
const messages_div = document.querySelector("#messages_div")
const template_message_div = document.querySelector("div[name='message_div']");
const status_div = document.querySelector('#status_div');
const parameter_div = document.querySelector('#parameter_div')

// Create conversation
const conversation = new Conversation(messages_div, template_message_div, status_div, parameter_div);

// Get buttons
const generate_button = document.querySelector('#generate');
const download_button = document.querySelector('#download');
const upload_button = document.querySelector('#upload');

// Bind buttons
generate_button.onclick = function () {
    if (generate_button.innerHTML === "Stop") {
        conversation.stop();
    } else {
        conversation.generate();
    }
}
download_button.onclick = conversation.download.bind(conversation);
upload_button.onclick = conversation.upload.bind(conversation);

// Bind Ctrl+Enter to generate
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        document.activeElement.blur();
        generate_button.click();
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

if (localStorage.getItem('token')) {
    await conversation.fetch_conversations();
}

import ConversationAutocomplete from './components/ConversationAutocomplete.js';

const select_div = ReactDOM.createRoot(document.getElementById('select'));
select_div.render(
    <React.StrictMode>
        <ConversationAutocomplete conversation={conversation} />
    </React.StrictMode>
);