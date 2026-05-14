from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import routes
from src.config import BACKEND_API_PORT, BACKEND_API_HOST, FRONTEND_URL

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.all_routes)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, port=BACKEND_API_PORT, host=BACKEND_API_HOST)
