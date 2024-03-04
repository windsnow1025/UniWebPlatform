# WindsnowGPT Documentation

## Introduction

WindsnowGPT, utilizing OpenAI completion models, bills costs to the API key owner, windsnow1024. New users start with 0 credits and should contact the author for account verification and credit increase. Verified users receive 5 free credits. Monthly, users gain 1 credit (up to 5). Credit usage depends on conversation length and is calculated based on OpenAI's pricing. Without credits, users must contact the author for more.

For further details:

- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/)
- [OpenAI Guide](https://platform.openai.com/docs/guides/)

Messages are processed using Marked.js and Katex. Expect more features and GUI enhancements soon.

## Instructions

Default user role: `user`. Use `system` for global rules or modify `assistant` replies. Disable Microsoft Editor to avoid unintended changes. For issues, try disabling extensions and refreshing (`Ctrl + F5`) or contact the author.

- **Temperature (0-2)**: Lower values yield predictable outputs; higher values produce varied results. Optimal range: 0-1.
- **Stream Mode**: Receive reply segments in real-time.

## Feature Comparison: WindsnowGPT vs ChatGPT

| Feature            | WindsnowGPT                                 | ChatGPT                                            | Advantage   |
|--------------------|---------------------------------------------|----------------------------------------------------|-------------|
| Message Editing    | Add / Edit / Delete at anywhere to any role | Add / Edit at conversation end to user             | WindsnowGPT |
| Model Selection    | All OpenAI and Azure Models available       | Default OpenAI GPT-3.5 & GPT-4 (Plus) available    | WindsnowGPT |
| Content Parsing    | Markdown and LaTeX in all messages rendered | Markdown and LaTeX in assistant rendered           | WindsnowGPT |
| Content Censorship | Basic API restrictions                      | Basic API restrictions and additional restrictions | WindsnowGPT |
| Customization      | Adjustable Temperature and Stream mode      | Fixed settings                                     | WindsnowGPT |
| Image Adding       | Supported                                   | Supported                                          | Equal       |
| Image Generation   | Not available                               | Only ChatGPT Plus                                  | ChatGPT     |
| Plugins            | Not available                               | Only ChatGPT Plus                                  | ChatGPT     |
| GPTs               | Not available                               | Only ChatGPT Plus                                  | ChatGPT     |

## Known Issues

- Cursor may move to the start of the streaming editable content.
