import logging
import os

import httpcore
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.chat_router import chat_router
from app.api.messages_convert_router import messages_convert_router
from app.api.root_router import root_router
from app.client.nest_js_client.errors import UnexpectedStatus
from app.config import init_env

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

init_env()

app = FastAPI(root_path=os.environ["FASTAPI_PATH_PREFIX"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(UnexpectedStatus)
async def unexpected_status_handler(request: Request, exc: UnexpectedStatus) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.content.decode(errors="ignore")})


@app.exception_handler(httpx.HTTPStatusError)
async def http_status_error_handler(request: Request, exc: httpx.HTTPStatusError) -> JSONResponse:
    return JSONResponse(status_code=exc.response.status_code, content={"detail": exc.response.text})


@app.exception_handler(httpcore.ConnectError)
@app.exception_handler(httpx.ConnectError)
async def connect_error_handler(request: Request, exc: Exception) -> JSONResponse:
    detail = f"ConnectError on {request.url.path}: {exc}"
    logging.exception(detail)
    return JSONResponse(status_code=500, content={"detail": detail})


@app.exception_handler(Exception)
async def fallback_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"detail": str(exc)})


app.include_router(root_router)
app.include_router(chat_router)
app.include_router(messages_convert_router)
