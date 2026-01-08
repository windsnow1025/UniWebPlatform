# Pricing

## Credit System

**1 Credit = 1 USD**

Credits are the currency used to access AI models on this platform.

## How Credits Are Consumed

Credit consumption is calculated based on:

1. **Input Tokens** - The number of tokens in your input (including the full conversation context)
2. **Output Tokens** - The number of tokens in the model's response
3. **Model Pricing** - Each model has different input/output prices per 1M tokens

### Calculation Formula

$$
\text{Credit Cost} = \frac{\text{Input Tokens} \times \text{Input Price}}{10^6} + \frac{\text{Output Tokens} \times \text{Output Price}}{10^6}
$$

### Where to Find Model Prices

You can view the input and output price per 1M tokens for each model in the **model dropdown** on the **AI Studio** page.

## Important Notes

> **Token Counting**: Token calculation methods vary by model provider. Our token counts are similar to but not identical to official provider counts.

> **Pricing**: Our prices are approximately **2x** the official provider rates to cover infrastructure and operational costs.
