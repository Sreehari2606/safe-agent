from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.hazard import Hazard, HazardStatus
from schemas.hazard import HazardCreate, HazardResponse, HazardUpdate, HazardListResponse, HazardVerifyRequest

router = APIRouter(prefix="/hazards", tags=["Hazards"])


@router.get("/", response_model=HazardListResponse)
def list_hazards(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    category: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Hazard)
    if category:
        query = query.filter(Hazard.category == category)
    if status:
        query = query.filter(Hazard.status == status)
    total = query.count()
    hazards = query.order_by(Hazard.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return HazardListResponse(hazards=hazards, total=total, page=page, page_size=page_size)


@router.post("/", response_model=HazardResponse, status_code=201)
def create_hazard(payload: HazardCreate, db: Session = Depends(get_db)):
    hazard = Hazard(**payload.model_dump(), is_demo=0)
    db.add(hazard)
    db.commit()
    db.refresh(hazard)
    return hazard


@router.get("/{hazard_id}", response_model=HazardResponse)
def get_hazard(hazard_id: int, db: Session = Depends(get_db)):
    hazard = db.query(Hazard).filter(Hazard.id == hazard_id).first()
    if not hazard:
        raise HTTPException(status_code=404, detail="Hazard not found")
    return hazard


@router.patch("/{hazard_id}", response_model=HazardResponse)
def update_hazard(hazard_id: int, payload: HazardUpdate, db: Session = Depends(get_db)):
    hazard = db.query(Hazard).filter(Hazard.id == hazard_id).first()
    if not hazard:
        raise HTTPException(status_code=404, detail="Hazard not found")
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(hazard, key, value)
    db.commit()
    db.refresh(hazard)
    return hazard


@router.post("/{hazard_id}/verify", response_model=HazardResponse)
def verify_hazard(hazard_id: int, payload: HazardVerifyRequest, db: Session = Depends(get_db)):
    hazard = db.query(Hazard).filter(Hazard.id == hazard_id).first()
    if not hazard:
        raise HTTPException(status_code=404, detail="Hazard not found")

    if payload.action == "still_there":
        hazard.confirmations = (hazard.confirmations or 0) + 1
        # If it was marked resolved or under review, bring it back to active
        if hazard.status == HazardStatus.resolved:
            hazard.status = HazardStatus.active
    elif payload.action == "cleared":
        hazard.cleared_reports = (hazard.cleared_reports or 0) + 1
        # Auto-resolve if 2+ riders report it cleared and cleared exceeds confirmations
        if hazard.cleared_reports >= 2 and hazard.cleared_reports >= (hazard.confirmations or 1):
            hazard.status = HazardStatus.resolved

    db.commit()
    db.refresh(hazard)
    return hazard


@router.delete("/{hazard_id}", status_code=204)
def delete_hazard(hazard_id: int, db: Session = Depends(get_db)):
    hazard = db.query(Hazard).filter(Hazard.id == hazard_id).first()
    if not hazard:
        raise HTTPException(status_code=404, detail="Hazard not found")
    db.delete(hazard)
    db.commit()

