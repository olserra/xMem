import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from services.sentiment import analyze_sentiment
from services.tagging import tag_memory_item
from schemas import TextIn, AgentChatRequest, AgentChatResponse
from typing import List, Optional
from services.topics import (
    extract_topics,
    topic_trends,
    detect_anomalies,
    topic_coverage,
)

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


@app.post("/topics")
def topics_endpoint(texts: List[str] = Body(..., embed=True)) -> dict:
    """Extract topics for a list of texts using BERTopic."""
    return extract_topics(texts)


@app.post("/topic-trends")
def topic_trends_endpoint(
    texts: List[str] = Body(..., embed=True),
    timestamps: Optional[List[str]] = Body(None, embed=True),
    time_format: str = Body("%Y-%m-%d", embed=True),
) -> dict:
    """Get topic trends over time for a list of texts and timestamps."""
    return topic_trends(texts, timestamps, time_format)


@app.post("/anomalies")
def anomalies_endpoint(texts: List[str] = Body(..., embed=True)) -> dict:
    """Detect anomalies in a list of texts using Isolation Forest."""
    return detect_anomalies(texts)


@app.post("/coverage")
def coverage_endpoint(
    texts: List[str] = Body(..., embed=True),
    expected_topics: Optional[List[str]] = Body(None, embed=True),
) -> dict:
    """Analyze topic coverage and gaps for a list of texts."""
    return topic_coverage(texts, expected_topics)
