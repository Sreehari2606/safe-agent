from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from models.hazard import HazardCategory, HazardSeverity, HazardStatus


class HazardBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5, max_length=1000)
    category: HazardCategory
    severity: HazardSeverity = HazardSeverity.medium
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_name: Optional[str] = None
    reported_by: Optional[str] = "Anonymous"


class HazardCreate(HazardBase):
    pass


class HazardUpdate(BaseModel):
    status: Optional[HazardStatus] = None
    severity: Optional[HazardSeverity] = None
    description: Optional[str] = None


class HazardVerifyRequest(BaseModel):
    action: str = Field(..., pattern="^(still_there|cleared)$")


class HazardResponse(HazardBase):
    id: int
    status: HazardStatus
    is_demo: int
    confirmations: int = 1
    cleared_reports: int = 0
    detour_name: Optional[str] = None
    detour_est_time: Optional[str] = None
    detour_coords: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HazardListResponse(BaseModel):
    hazards: list[HazardResponse]
    total: int
    page: int
    page_size: int

