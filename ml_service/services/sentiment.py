from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from fastapi import HTTPException
from schemas import TextIn

analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(data: TextIn) -> dict:
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
