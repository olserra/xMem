from fastapi import HTTPException
from schemas import TextIn
from keybert import KeyBERT

# Initialize KeyBERT model (using default, can specify model if needed)
kw_model = KeyBERT()


def tag_memory_item(data: TextIn) -> dict:
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")
    # Extract top 3 keywords/phrases
    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=3
    )
    tags = [kw[0] for kw in keywords]
    return {"tags": tags}
