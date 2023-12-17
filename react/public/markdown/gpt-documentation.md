# WindsnowGPT Documentation

## Introduction

WindsnowGPT is powered by OpenAI completion models. Any cost will incur to windsnow1024, the owner of the API key.

See [OpenAI Pricing](https://openai.com/pricing), [OpenAI Models](https://platform.openai.com/docs/models), [OpenAI API Reference](https://platform.openai.com/docs/api-reference/), [GPT Guide](https://platform.openai.com/docs/guides/gpt) for more information.

All messages are parsed by Marked.js and Katex.

More features and GUI improvements are coming soon.

## Instructions

The default role for user is `user`. You can define global rules using the `system` role, or modify the reply of `assistant`.

It is crucial to disable Microsoft Editor to prevent the contents from being unexpectedly changed. If the website is not working properly, please first consider disabling all extensions (especially AdBlock and Microsoft Editor) and press `Ctrl + F5` to refresh. If the problem still exists, please contact author.

**Temperature** is a value between 0 and 2. The lower the temperature, the more likely the model will output the most likely next token. The higher the temperature, the more likely the model will output a less likely token. The recommended value is between 0 and 1.

**Stream** mode enables you to receive the chunks of the reply as soon as they are generated.

## Why not ChatGPT?

You could add a message at any place as any role in WindsnowGPT, while ChatGPT only allows you to add a message as a user at the end of the conversation.

Any message at any place can be added, edited or deleted in WindsnowGPT, which is not possible in ChatGPT.

You could set the system role to define global rules in WindsnowGPT, while the content of the system role in ChatGPT is fixed.

You could select the model freely in WindsnowGPT, while ChatGPT only uses the default model.

Every message content is parsed to display the markdown and latex in WindsnowGPT, while ChatGPT only render the content output by the assistant.

No additional content censorship imposed in WindsnowGPT, while ChatGPT will restrict illegal input and output contents.

The temperature and the output mode is adjustable in WindsnowGPT, which is not in ChatGPT.

The maximum single content length is based on the maximum tokens of the model, while there is a tighter limit in ChatGPT.

## Known Bugs

Cursor will automatically move to the beginning of the editable content which is being streamed.