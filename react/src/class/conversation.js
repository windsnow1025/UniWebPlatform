import axios from "axios";
import { MessageController } from "../controller/MessageController.js";

export class Conversation {
    /**
     * Constructor
     * @param {HTMLDivElement} messages_div
     * @param {HTMLDivElement} template_message_div
     * @param {HTMLDivElement} status_div
     * @param {HTMLDivElement} parameter_div
     */
    constructor(messages_div, template_message_div, status_div, parameter_div) {
        this.messages_div = messages_div;
        this.template_message_div = template_message_div;
        this.status_div = status_div;
        this.parameter_div = parameter_div;

        /** @type {Array} */
        this.conversations = [];
        /** @type {MessageController[]} */
        this.messageControllers = [];
        /** @type {boolean[]} */
        this.wait_response = [];
        /** @type {AbortController} */
        this.controller = null;

        /** @type {HTMLButtonElement} */
        this.generate_button = this.status_div.querySelector('#generate');
        /** @type {HTMLElement} */
        this.status_elem = this.status_div.querySelector('#status');

        /** @type {string} */
        this.token = localStorage.getItem('token');

        this.clear_message_divs();
        this.add(0, "system", this.getSystemContent());
        this.add(1);
    }

    getSystemContent() {
        const date = new Date();
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const currentDate = `${year}-${month}-${day}`;
        return "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.\n" +
            "Knowledge cutoff: 2022-01\n" +
            "Current date: " + currentDate;
    }

    // Serialize messages[] to JSON
    serializeMessages() {
        return JSON.stringify(this.messageControllers.map(messageController => {
            return {
                role: messageController.model.role,
                content: messageController.model.content
            }
        }));
    }

    // Create and render message_div[] from messages[]
    clear_message_divs() {
        // Clear messages_div
        this.messages_div.innerHTML = "";

        // Create and render
        // Add Button
        const add_button_div_template = this.template_message_div.querySelector('div[name="add_button_div"]');
        const add_button_div = add_button_div_template.cloneNode(true);
        const add_button = add_button_div.querySelector('i[name="add_button"]');
        this.messages_div.appendChild(add_button_div);
        add_button.onclick = function () {
            this.add(0);
        }.bind(this);
    }

    // Create and render message_div[index] from messages[index]
    create_render_message_div(index, message_div) {
        // Copy button
        const copy_button = message_div.querySelector('i[name="copy_button"]');
        copy_button.onclick = function () {
            // UI to logic: index - 1
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.copy(currentIndex);
        }.bind(this);

        // Delete button
        const delete_button = message_div.querySelector('i[name="delete_button"]');
        delete_button.onclick = function () {
            // UI to logic: index - 1
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.delete(currentIndex);
        }.bind(this);

        // Add Button
        const add_button = message_div.querySelector('i[name="add_button"]');
        add_button.onclick = function () {
            // UI to logic: index - 1
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div)-1;
            this.add(currentIndex + 1);
        }.bind(this);

        // Insert the new message div to the messages div
        // Logic to UI: index + 1
        this.messages_div.insertBefore(message_div, this.messages_div.childNodes[index + 1]);
    }

    // Render message_div[index] from messages[index]
    render_message_div(index, parse = true) {
        const messageController = this.messageControllers[index];

        if (messageController.view.content_div == document.activeElement) parse = false;

        messageController.view.render({ role: messageController.model.role, content: messageController.model.content, parseContent: parse });
    }

    // Generate Response
    async generate() {
        // If not logged in, return
        this.token = localStorage.getItem('token');
        if (!this.token) {
            alert("Please sign in first.");
            return;
        }

        // Get parameters
        const messages = this.serializeMessages();
        const api_type = this.parameter_div.querySelector("#api_type").value;
        const model = this.parameter_div.querySelector("#model").value;
        const temperature = this.parameter_div.querySelector("#temperature").value;
        const stream = this.parameter_div.querySelector("#stream").checked;

        // Create a new form data object
        const formData = new FormData();
        formData.append("messages", messages);
        formData.append("api_type", api_type);
        formData.append("model", model);
        formData.append("temperature", temperature);
        formData.append("stream", stream);

        // Set status
        this.status_elem.innerHTML = "Generating...";
        this.generate_button.innerHTML = "Stop";

        // Stream mode off
        if (!stream) {
            try {
                // Set wait_response status to true
                this.wait_response.push(true);
                const current_wait_response_index = this.wait_response.length - 1;

                const res = await axios.post("/api/gpt/", formData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                // Stop if not waiting for response
                if (!this.wait_response[current_wait_response_index]) return;

                // Get the response
                let content = res.data;
                content = content.replace("<", "&lt;").replace(">", "&gt;");

                // Add the response to the last message div
                this.add(this.messageControllers.length, "assistant", content);

                // Add a new message div
                this.add(this.messageControllers.length);

                // Set status
                this.status_elem.innerHTML = "Ready";
                this.generate_button.innerHTML = "Generate";
            } catch (error) {
                this.status_elem.innerHTML = error;
                this.generate_button.innerHTML = "Generate";
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
            this.messageControllers[this.messageControllers.length - 1].model.content += chunk;


            // Check if user is at the bottom of the page before appending the chunk
            // Compare the scroll height minus the scroll position with the client height (plus an offset if necessary).
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

            // Append the chunk to the message div
            const messageController = this.messageControllers[this.messageControllers.length - 1];
            messageController.view.content_div.innerHTML += chunk;

            if (isAtBottom) {
                // Scroll to the bottom of the page
                window.scrollTo(0, document.body.scrollHeight);
            }

            await processChunk.bind(this)(reader, controller);
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
                    start: async (controller) => {
                        this.add(this.messageControllers.length, "assistant", "", true);
                        await processChunk.bind(this)(reader, controller);
                    },
                }, {signal: this.controller.signal});

                await processedStream.getReader().read();

                // Render the last message div
                this.render_message_div(this.messageControllers.length - 1);

                // Add a new message div
                this.add(this.messageControllers.length);

                // Set status
                this.status_elem.innerHTML = "Ready";
                this.generate_button.innerHTML = "Generate";
            } catch (error) {
                this.status_elem.innerHTML = error;
                this.generate_button.innerHTML = "Generate";
            }
        }

        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Stop generating response
    stop() {
        // Set all wait_response status to false
        this.wait_response = this.wait_response.map(() => false);

        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status_elem.innerHTML = "Ready";
        this.generate_button.innerHTML = "Generate";
    }

    // Focus on the content of message at index
    focus(index) {
        // Logic to UI: index + 1
        const message_div = this.messages_div.childNodes[index + 1];
        message_div.querySelector('div[name="content"]').focus();
    }

    // Add a new message at index
    add(index, role = "user", content = "", generating = false) {
        // If not generating
        if (!generating) {
            // Abort controller
            if (this.controller) {
                this.controller.abort();
            }

            // Set status
            this.status_elem.innerHTML = "Ready";
            this.generate_button.innerHTML = "Generate";
        }

        // Get the template message div and clone it
        const message_div = this.template_message_div.cloneNode(true);

        // Create and render the new message div at index
        const messageController = new MessageController(role, content, message_div);
        this.messageControllers.splice(index, 0, messageController);
        this.create_render_message_div(index, message_div);

        // Re-render the messages div from index + 1
        for (let i = index + 1; i < this.messageControllers.length; i++) {
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
        this.status_elem.innerHTML = "Ready";
        this.generate_button.innerHTML = "Generate";

        // Delete the message at index
        this.messageControllers.splice(index, 1);
        // Logic to UI: index + 1
        this.messages_div.removeChild(this.messages_div.childNodes[index + 1]);
    }

    // Copy to clipboard
    copy(index) {
        // Get message content
        const content = this.messageControllers[index].model.content;

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
                this.messageControllers = [];
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

    async cloudUpload(name) {
        // Prepare data
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
    }

    async cloudUpdate(index, name) {
        // Prepare data
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
    }

    async cloudUpdateName(index, name) {
        // Prepare data
        const id = this.conversations[index].id;
        const data = {
            name: name,
            id: id
        };

        // Update to cloud
        await axios.put(`/api/conversation/name`, {
            data: data
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }

    setConversation(index) {
        // Get the conversation
        const messages = JSON.parse(this.conversations[index].conversation);

        // Re-render the messages div
        this.clear_message_divs();
        this.messageControllers = [];
        for (let i = 0; i < messages.length; i++) {
            this.add(i, messages[i].role, messages[i].content);
        }
    }

    async cloudDelete(index) {
        await axios.delete(`/api/conversation/${this.conversations[index].id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
}
