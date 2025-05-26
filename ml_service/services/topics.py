from bertopic import BERTopic
from keybert import KeyBERT
from typing import List, Dict, Optional
from fastapi import HTTPException
import pandas as pd
from sklearn.ensemble import IsolationForest
from collections import Counter, defaultdict
from datetime import datetime
import re

# For now, use a singleton topic model (can be improved with persistence)
topic_model = BERTopic(verbose=False)

# Helper: fit or update the topic model
# In production, you would persist the model and update incrementally


def extract_topics(texts: List[str]) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for topic modeling."
        )
    # Simple keyword frequency analysis for demo purposes
    all_words = []
    for text in texts:
        words = re.findall(r"\b\w{4,}\b", text.lower())  # words with 4+ chars
        all_words.extend(words)
    most_common = Counter(all_words).most_common(5)
    topic_labels = [w for w, _ in most_common]
    return {
        "topics": topic_labels,
        "topic_labels": topic_labels,
        "topic_info": most_common,
    }


def topic_trends(
    texts: List[str],
    timestamps: Optional[List[str]] = None,
    time_format: str = "%Y-%m-%d",
) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for trend analysis."
        )
    if timestamps is None:
        timestamps = [datetime.now().strftime(time_format)] * len(texts)
    # Group texts by timestamp
    trend = defaultdict(Counter)
    for text, ts in zip(texts, timestamps):
        words = re.findall(r"\b\w{4,}\b", text.lower())
        trend[ts].update(words)
    # For each timestamp, get the top 3 words
    trend_dict = {ts: dict(cnt.most_common(3)) for ts, cnt in trend.items()}
    return {"trend": trend_dict}


def detect_anomalies(texts: List[str]) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for anomaly detection."
        )
    # Simple anomaly: texts that are much longer or shorter than the median
    lengths = [len(t) for t in texts]
    if not lengths:
        return {"anomaly_indices": [], "anomaly_texts": []}
    median = sorted(lengths)[len(lengths) // 2]
    anomalies = [i for i, l in enumerate(lengths) if l > median * 2 or l < median * 0.5]
    return {
        "anomaly_indices": anomalies,
        "anomaly_texts": [texts[i] for i in anomalies],
    }


def topic_coverage(
    texts: List[str], expected_topics: Optional[List[str]] = None
) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for coverage analysis."
        )
    all_words = []
    for text in texts:
        words = re.findall(r"\b\w{4,}\b", text.lower())
        all_words.extend(words)
    found_topics = set([w for w, _ in Counter(all_words).most_common(20)])
    if expected_topics is None:
        expected_topics = list(found_topics)
    missing_topics = set(expected_topics) - found_topics
    coverage = {t: (t in found_topics) for t in expected_topics}
    return {
        "coverage": coverage,
        "missing_topics": list(missing_topics),
        "found_topics": list(found_topics),
    }


# For trend analysis, you can call this with time-binned texts
