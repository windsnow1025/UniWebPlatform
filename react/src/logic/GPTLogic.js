import ConversationService from "../service/ConversationService";

export class GPTLogic {

  constructor() {
    this.conversationService = new ConversationService();

    this.initMessages = [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      }
    ];

    this.models = {
      "open_ai": [
          "gpt-3.5-turbo",
          "gpt-3.5-turbo-0301",
          "gpt-3.5-turbo-0613",
          "gpt-3.5-turbo-1106",
          "gpt-3.5-turbo-16k",
          "gpt-3.5-turbo-16k-0613",
          "gpt-4",
          "gpt-4-0314",
          "gpt-4-0613",
          "gpt-4-1106-preview",
          "gpt-4-vision-preview"
      ],
      "azure": [
        "gpt-35-turbo",
        "gpt-35-turbo-16k",
        "gpt-4",
        "gpt-4-32k"
      ]
    }


  }
}