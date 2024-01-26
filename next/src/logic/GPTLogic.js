import GPTService from "../service/GPTService";

export class GPTLogic {

  constructor() {

    this.gptService = new GPTService();

    this.initMessages = [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": ""
      }
    ];

    this.models = {
      "open_ai": [
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-0301",
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-1106",
        "gpt-3.5-turbo-0125",
        "gpt-3.5-turbo-16k",
        "gpt-3.5-turbo-16k-0613",
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-0613",
        "gpt-4-32k-0314",
        "gpt-4-turbo-preview",
        "gpt-4-1106-preview",
        "gpt-4-0125-preview",
        "gpt-4-vision-preview"
      ],
      "azure": [
        "gpt-35-turbo",
        "gpt-35-turbo-16k",
        "gpt-4",
        "gpt-4-32k"
      ]
    }

    this.defaultApiType = "open_ai";
    this.defaultModel = "gpt-4-turbo-preview";
  }


  // Save the messages array as a JSON file
  export(messages) {
    const fileName = 'messages.json';
    const data = JSON.stringify(messages);
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
  import() {
    return new Promise((resolve, reject) => {
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

          // Resolve the promise with the messages
          resolve(messages);
        }

        // Reject the promise if there's an error
        reader.onerror = error => reject(error);
      }
      input.click();

      // Scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async nonStreamGenerate(messages, api_type, model, temperature, stream) {
    try {
      const content = await this.gptService.generate(this.processMessages(messages), api_type, model, temperature, stream);
      return this.sanitize(content);
    } catch (err) {
      console.error("Error in POST /:", err);
      return "Error occurred while generating data.";
    }
  }

  async *streamGenerate(messages, api_type, model, temperature, stream) {
    let controller;

    try {

      const response = await this.gptService.generate(this.processMessages(messages), api_type, model, temperature, stream);
      controller = response.controller;
      const reader = response.reader;

      while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        yield this.sanitize(new TextDecoder().decode(value));
      }

    } catch (err) {

      console.error("Error in POST /:", err);
      return "Error occurred while generating data.";

    } finally {

      if (controller) {
        controller.abort();
      }

    }
  }

  sanitize(content) {
    return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  processMessages(messages) {
    return messages.map(message => {
      const newMessage = { ...message };

      if (newMessage.files) {
        newMessage.content = this.addUrlsToContent(newMessage.content, newMessage.files);
        delete newMessage.files;
      }
      return newMessage;
    });
  }

  addUrlsToContent(content, urls) {
    let contentArray = [{"type": "text", "text": content}];

    urls.forEach(url => {
      contentArray.push({
        "type": "image_url",
        "image_url": url
      });
    });

    return contentArray;
  }
}