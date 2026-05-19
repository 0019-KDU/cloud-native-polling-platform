from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.database import engine, Base
from app.routers import analytics

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Analytics Service",
    description="Poll analytics and vote statistics aggregation",
    version="1.0.0",
    docs_url="/api/analytics/docs",
    redoc_url="/api/analytics/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router, prefix="/api/analytics")


@app.get("/api/analytics/health")
def health():
    return {"status": "UP", "service": "analytics-service"}
