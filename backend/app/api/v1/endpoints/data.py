from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.schemas.data import DataCreate, DataResponse
from app.services.data import DataService

router = APIRouter()

@router.post("/process", response_model=DataResponse)
async def process_data(
    data: DataCreate,
    db: Session = Depends(get_db)
):
    """
    Process and store data with embeddings
    """
    try:
        data_service = DataService(db)
        result = await data_service.process_data(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/search", response_model=List[DataResponse])
async def semantic_search(
    query: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Perform semantic search on stored data
    """
    try:
        data_service = DataService(db)
        results = await data_service.semantic_search(query, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 