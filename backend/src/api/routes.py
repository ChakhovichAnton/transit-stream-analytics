from fastapi import APIRouter
import datetime

from src.api.v1 import transit

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(transit.router)

all_routes = APIRouter(prefix="/api")

@all_routes.get("/health")
async def health():
    return {"data": datetime.datetime.now()}

all_routes.include_router(v1_router)
