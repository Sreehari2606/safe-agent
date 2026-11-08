from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from database import Base
import enum


class HazardCategory(str, enum.Enum):
    flooding = "flooding"
    roadblock = "roadblock"
    poor_lighting = "poor_lighting"
    accident = "accident"
    construction = "construction"
    waterlogging = "waterlogging"
    other = "other"


class HazardSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class HazardStatus(str, enum.Enum):
    active = "active"
    resolved = "resolved"
    under_review = "under_review"


class Hazard(Base):
    __tablename__ = "hazards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(SAEnum(HazardCategory), nullable=False)
    severity = Column(SAEnum(HazardSeverity), nullable=False, default=HazardSeverity.medium)
    status = Column(SAEnum(HazardStatus), nullable=False, default=HazardStatus.active)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String, nullable=True)
    reported_by = Column(String, nullable=True, default="Anonymous")
    is_demo = Column(Integer, nullable=False, default=0)   # 1 = demo/seed data
    confirmations = Column(Integer, nullable=False, default=1)  # "Still there" upvotes
    cleared_reports = Column(Integer, nullable=False, default=0)  # "Cleared" reports
    detour_name = Column(String, nullable=True)  # Suggested alternative route
    detour_est_time = Column(String, nullable=True)  # Estimated detour time e.g. "+6 mins"
    detour_coords = Column(String, nullable=True)  # JSON-encoded array of [lat, lon] waypoints
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

