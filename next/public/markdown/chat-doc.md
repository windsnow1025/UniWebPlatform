# AI Chat Documentation

## Introduction

AI Chat, utilizing OpenAI GPT & Google Gemini chat models, bills costs to the API key owner.
New users start with 0 credits.
Users verified by contacting the author will receive 5 free initial credits.
Credit usage depends on input length & output length & model pricing.
Contact the author to ask for more credits.

For further details:

- [OpenAI Pricing](https://openai.com/pricing)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [Gemini Models](https://ai.google.dev/models/gemini)

Messages are processed using Marked.js and Katex. Expect more features and GUI enhancements soon.

## Instructions

Default user role: `user`. Use `system` for global rules or modify `assistant` replies.
Disable Microsoft Editor to avoid unintended changes.
For issues, try disabling extensions and refreshing (`Ctrl + F5`) or contact the author.

- **Temperature (0-2)**: Lower values yield predictable outputs; higher values produce varied results. Optimal range:
  0-1.
- **Stream Mode**: Receive reply segments in real-time.

## Feature Comparison: AI Chat vs ChatGPT vs Gemini

| Feature                | AI Chat                                     | ChatGPT App / Playground                       | Gemini App / Google AI Studio                                | Advantage |
|------------------------|---------------------------------------------|------------------------------------------------|--------------------------------------------------------------|-----------|
| Message Editing        | Add / Edit / Delete at anywhere to any role | Add / Edit at conversation end to user         | Add / Edit at conversation end to user                       | AI Chat   |
| Model Selection        | All OpenAI & Azure & Gemini models          | GPT-3.5 & GPT-4 (Plus)                         | Gemini 1.0 Pro & Gemini 1.5 Pro (Gemini Advanced)            | AI Chat   |
| Content Parsing        | Markdown and LaTeX in all messages rendered | Markdown & LaTeX in response rendered          | Markdown in response rendered                                | AI Chat   |
| Content Censorship     | Basic API restrictions                      | Basic API and additional restrictions          | Basic API and additional restrictions                        | AI Chat   |
| Settings Customization | Temperature and Stream mode adjustable      | Fixed settings (App) / Adjustable (Playground) | Fixed settings (App) / Adjustable (Studio)                   | AI Chat   |
| File Processing        | Image                                       | Image & File (App) / None (Playground)         | Image (App) / Image & Video & Audio & File & Folder (Studio) | Gemini    |
| Image Generation       | Not available                               | Only ChatGPT Plus                              | Not available                                                | ChatGPT   |
| Pricing                | Pay as you go                               | $20 ($19.99) / month                           | $19.99 / month                                               | AI Chat   |

## Known Issues

- Cursor may move to the start of the streaming editable content.
