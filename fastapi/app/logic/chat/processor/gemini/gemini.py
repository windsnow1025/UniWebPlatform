import os

import google.generativeai as genai

from app.config import init_env

init_env()
genai.configure(api_key=os.environ["GOOGLE_AI_STUDIO_API_KEY"])


generation_config = {
    "temperature": 0
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    },
]

model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

messages = [
    {
        'role': 'user',
        'parts': ["Briefly explain how a computer works to a young child."]
    },
    {
        'role': 'model',
        'parts': ["Imagine a computer like a really smart toy box! Inside, there are tiny switches that can be either on or off, like little light switches. These switches work together to follow instructions we give the computer, like showing pictures or playing music. We use a keyboard, mouse, or touchscreen to tell the computer what to do, and it uses those tiny switches to make it happen! It's like magic, but with switches! "]
    },
    {
        'role': 'user',
        'parts': ["Okay, how about a more detailed explanation to a high school student?"]
    }
]

response = model.generate_content(messages, stream=True)
for chunk in response:
  print(chunk.text)
  print("_"*80)
