# Windsnow GPT Documentation

## Introduction

Windsnow GPT is powered by OpenAI `gpt-4-0314` model with a maximum token of 8192. The `api_key` is provided by windsnow1024.

Each `gpt-4-0314` request will incur a cost (Prompt: `$0.03 / 1,000 tokens`, Completion: `$0.06 / 1000 tokens`) for the `api_key` which price is between 15 times and 30 times of `gpt-3.5-turbo-0301` which price is `$0.002 / 1,000 tokens`. All history in your current webpage will be sent to API. If you have a frequent usage, please contact windsnow1024 (windsnow1025@gmail.com) for donations.

If GPT is not responding, please consider if the input exceeds the token limit of the current model. If the website is not working properly, please first consider disabling all extensions (especially AdBlock and Microsoft Editor) and press `Ctrl + F5` to refresh. If the problem still exists, please contact windsnow1024.

All contents are parsed by Marked.js and MathJax.

Your data won't be stored in the server currently. Login system is still under development, which will enable users to save their conversations to the cloud. More features will be added in the future.

## Instructions

The default role for user is `user`. You can define global rules using the `system` role, or modify the reply of `assistant`.

It is crucial to disable Microsoft Editor to prevent the contents from being unexpectedly changed.

Temperature is a value between 0 and 2. The lower the temperature, the more likely the model will output the most likely next token. The higher the temperature, the more likely the model will output a less likely token. The recommended value is between 0 and 1.

Stream mode enables you to receive the chunks of the reply as soon as they are generated.

## Why not ChatGPT?

You could add a message at any place as any role in Windsnow GPT, while ChatGPT only allows you to add a message as a user at the end of the conversation.

Any message at any place can be added, edited or deleted in Windsnow GPT, which is not possible in ChatGPT.

You could set the system role to define global rules in Windsnow GPT, while the content of the system role in ChatGPT is fixed.

Every message content is parsed to display the markdown and latex in Windsnow GPT, while ChatGPT only render the content output by the assistant.

There is no additional content sensorship in Windsnow GPT, while ChatGPT will restrict illegal input and output contents.

The temperature and the output mode is adjustable in Windsnow GPT, which is not in ChatGPT.

The maximum single content length is based on the maximum tokens of the model, while there is a tighter limit in ChatGPT.

## Known Bugs

Cursor will automatically move to the beginnning of the editable content which is being streamed.
