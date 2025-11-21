import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat_router import chat_router
from app.api.messages_convert_router import messages_convert_router
from app.config import init_env

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

init_env()

app = FastAPI(root_path=os.environ.get("FASTAPI_PATH_PREFIX"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(messages_convert_router)
