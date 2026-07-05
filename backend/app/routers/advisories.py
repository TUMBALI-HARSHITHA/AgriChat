from fastapi import APIRouter, Depends, HTTPException, Query, status, Header
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.routers.auth import verify_token
from app.schemas import (
    AdvisoryCreate, AdvisoryUpdate, AdvisoryPatch, 
    AdvisoryResponse, AdvisoryStats
)
from app import crud

# Dependency to fetch optional authenticated user
def get_optional_current_user(
    authorization: str | None = Header(None, description="Bearer <token>"),
    db: Session = Depends(get_db)
) -> User | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id).first()

router = APIRouter(prefix="/api/advisories", tags=["Advisories"])

@router.get("/", response_model=List[AdvisoryResponse])
def read_advisories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    crop: str | None = Query(None, description="Filter advisories by crop name (case-insensitive)"),
    region: str | None = Query(None, description="Filter advisories by region name (case-insensitive)"),
    severity: str | None = Query(None, description="Filter advisories by severity (Low/Medium/High)"),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user)
):
    """Retrieve a list of agricultural advisories with pagination and optional filters."""
    created_by_id = user.id if user else None
    return crud.get_advisories(db, skip=skip, limit=limit, crop=crop, region=region, severity=severity, created_by_id=created_by_id)

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
def create_advisory(
    advisory: AdvisoryCreate, 
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user)
):
    """
    Create a new advisory.
    
    If `advice` is omitted or empty, the backend will auto-generate it using
    the Gemini API (if configured in environment variables) or fall back to draft placeholder advice.
    """
    created_by_id = user.id if user else None
    return crud.create_advisory(db=db, advisory=advisory, created_by_id=created_by_id)

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
def delete_advisory(
    advisory_id: int, 
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user)
):
    """Delete an existing advisory by its ID, enforcing ownership check."""
    db_advisory = crud.get_advisory(db, advisory_id=advisory_id)
    if not db_advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory with ID {advisory_id} not found"
        )
    
    if db_advisory.created_by_id is not None:
        if not user or user.id != db_advisory.created_by_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this advisory"
            )
            
    crud.delete_advisory(db=db, advisory_id=advisory_id)
    return None

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_advisories(
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user)
):
    """Delete all advisories belonging to the logged-in user, or all anonymous advisories."""
    created_by_id = user.id if user else None
    from app.models import Advisory
    query = db.query(Advisory)
    if created_by_id is not None:
        query = query.filter(Advisory.created_by_id == created_by_id)
    else:
        query = query.filter(Advisory.created_by_id.is_(None))
        
    query.delete(synchronize_session=False)
    db.commit()
    return None
