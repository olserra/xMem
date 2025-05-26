import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.sentiment import analyze_sentiment
from services.tagging import tag_memory_item
from schemas import TextIn

app = FastAPI()

# Use env var for allowed origins, default to * for dev
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    """Root endpoint with welcome message."""
    return {"message": "Welcome to the Sentiment Analysis API!"}


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/sentiment")
def sentiment_endpoint(data: TextIn) -> dict:
    """Analyze sentiment of the provided text."""
    return analyze_sentiment(data)


@app.post("/tags")
def tags_endpoint(data: TextIn) -> dict:
    """Extract tags for the provided memory item text."""
    return tag_memory_item(data)
