from bertopic import BERTopic
from keybert import KeyBERT
from typing import List, Dict, Optional
from fastapi import HTTPException
import pandas as pd
from sklearn.ensemble import IsolationForest
from collections import Counter
from datetime import datetime

# For now, use a singleton topic model (can be improved with persistence)
topic_model = BERTopic(verbose=False)

# Helper: fit or update the topic model
# In production, you would persist the model and update incrementally


def extract_topics(texts: List[str]) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for topic modeling."
        )
    topics, probs = topic_model.fit_transform(texts)
    topic_info = topic_model.get_topic_info()
    topic_labels = [
        topic_model.get_topic(topic)[0][0] if topic != -1 else "Other"
        for topic in topics
    ]
    return {
        "topics": topics,
        "topic_labels": topic_labels,
        "topic_info": topic_info.to_dict(orient="records"),
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
    topics, _ = topic_model.fit_transform(texts)
    if timestamps is None:
        timestamps = [datetime.now().strftime(time_format)] * len(texts)
    df = pd.DataFrame({"topic": topics, "timestamp": timestamps})
    df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.strftime(time_format)
    trend = df.groupby(["timestamp", "topic"]).size().unstack(fill_value=0)
    return {"trend": trend.to_dict()}


def detect_anomalies(texts: List[str]) -> Dict:
    if not texts:
        raise HTTPException(
            status_code=400, detail="No texts provided for anomaly detection."
        )
    # Use KeyBERT to get embeddings
    kw_model = KeyBERT()
    embeddings = [kw_model.model.encode(text) for text in texts]
    clf = IsolationForest(contamination=0.1, random_state=42)
    preds = clf.fit_predict(embeddings)
    anomalies = [i for i, p in enumerate(preds) if p == -1]
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
    topics, _ = topic_model.fit_transform(texts)
    topic_info = topic_model.get_topic_info()
    found_topics = set(topic_info["Name"]) - {"-1_other"}
    if expected_topics is None:
        # Use all found topics as expected if not provided
        expected_topics = list(found_topics)
    missing_topics = set(expected_topics) - found_topics
    coverage = {t: (t in found_topics) for t in expected_topics}
    return {
        "coverage": coverage,
        "missing_topics": list(missing_topics),
        "found_topics": list(found_topics),
    }


# For trend analysis, you can call this with time-binned texts
