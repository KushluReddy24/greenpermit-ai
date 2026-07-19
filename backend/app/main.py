from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.predict import router as predict_router

app = FastAPI(
    title="GreenPermit AI API",
    version="1.0.0",
    description="Backend for GreenPermit AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # We'll restrict this before deployment if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(predict_router)