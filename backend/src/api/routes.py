from fastapi import APIRouter
import datetime

#v1_router = APIRouter(prefix="/v1")

all_routes = APIRouter(prefix="/api")

@all_routes.get("/health")
async def health():
    return {"data": datetime.datetime.now()}

#all_routes.include_router(v1_router)
