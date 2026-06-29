from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import (
    AdvisoryCreate, AdvisoryUpdate, AdvisoryPatch, 
    AdvisoryResponse, AdvisoryStats
)
from app import crud

router = APIRouter(prefix="/api/advisories", tags=["Advisories"])

@router.get("/", response_model=List[AdvisoryResponse])
def read_advisories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    crop: str | None = Query(None, description="Filter advisories by crop name (case-insensitive)"),
    region: str | None = Query(None, description="Filter advisories by region name (case-insensitive)"),
    severity: str | None = Query(None, description="Filter advisories by severity (Low/Medium/High)"),
    db: Session = Depends(get_db)
):
    """Retrieve a list of agricultural advisories with pagination and optional filters."""
    return crud.get_advisories(db, skip=skip, limit=limit, crop=crop, region=region, severity=severity)

@router.get("/search", response_model=List[AdvisoryResponse])
def search_advisories(
    q: str = Query(..., min_length=1, description="Case-insensitive search query matching crop, query, advice, or region"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search advisories containing the query text in any of their primary fields."""
    return crud.search_advisories(db, search_query=q, skip=skip, limit=limit)

@router.get("/stats", response_model=AdvisoryStats)
def read_advisory_stats(db: Session = Depends(get_db)):
    """Retrieve aggregate statistics about the stored advisories (total count and group counts)."""
    return crud.get_advisory_stats(db)

@router.get("/{advisory_id}", response_model=AdvisoryResponse)
def read_advisory(advisory_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific agricultural advisory by its unique ID."""
    db_advisory = crud.get_advisory(db, advisory_id=advisory_id)
    if not db_advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory with ID {advisory_id} not found"
        )
    return db_advisory

@router.post("/", response_model=AdvisoryResponse, status_code=status.HTTP_201_CREATED)
def create_advisory(advisory: AdvisoryCreate, db: Session = Depends(get_db)):
    """
    Create a new advisory.
    
    If `advice` is omitted or empty, the backend will auto-generate it using
    the Gemini API (if configured in environment variables) or fall back to draft placeholder advice.
    """
    return crud.create_advisory(db=db, advisory=advisory)

@router.put("/{advisory_id}", response_model=AdvisoryResponse)
def update_advisory(
    advisory_id: int, 
    advisory_update: AdvisoryUpdate, 
    db: Session = Depends(get_db)
):
    """Fully update all fields of an existing advisory."""
    db_advisory = crud.update_advisory(db=db, advisory_id=advisory_id, advisory_update=advisory_update)
    if not db_advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory with ID {advisory_id} not found"
        )
    return db_advisory

@router.patch("/{advisory_id}", response_model=AdvisoryResponse)
def patch_advisory(
    advisory_id: int, 
    advisory_patch: AdvisoryPatch, 
    db: Session = Depends(get_db)
):
    """Partially update fields of an existing advisory."""
    db_advisory = crud.patch_advisory(db=db, advisory_id=advisory_id, advisory_patch=advisory_patch)
    if not db_advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory with ID {advisory_id} not found"
        )
    return db_advisory

@router.delete("/{advisory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_advisory(advisory_id: int, db: Session = Depends(get_db)):
    """Delete an existing advisory by its ID."""
    db_advisory = crud.delete_advisory(db=db, advisory_id=advisory_id)
    if not db_advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory with ID {advisory_id} not found"
        )
    return None
