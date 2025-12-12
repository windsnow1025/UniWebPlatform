from fastapi import APIRouter

root_router = APIRouter()


@root_router.get("/")
def root():
    return {"message": "Welcome to the FastAPI. See /docs for details."}
