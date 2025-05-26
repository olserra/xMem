import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pydantic import BaseModel

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

analyzer = SentimentIntensityAnalyzer()


class TextIn(BaseModel):
    text: str


@app.get("/")
def root() -> dict:
    """Root endpoint with welcome message."""
    return {"message": "Welcome to the Sentiment Analysis API!"}


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/sentiment")
def analyze_sentiment(data: TextIn) -> dict:
    """Analyze sentiment of the provided text."""
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")
    vs = analyzer.polarity_scores(text)
    compound = vs["compound"]
    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return {"sentiment": sentiment, "score": compound}
