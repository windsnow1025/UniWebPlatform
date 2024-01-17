import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.completion_router import router as completion_router
from app.config import init_environment

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

init_environment()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(completion_router)
