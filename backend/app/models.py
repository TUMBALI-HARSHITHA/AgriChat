from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base

class Advisory(Base):
    __tablename__ = "advisories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crop = Column(String, index=True, nullable=False)
    query = Column(String, nullable=False)
    advice = Column(String, nullable=False)
    region = Column(String, index=True, nullable=False)
    severity = Column(String, index=True, nullable=False)  # e.g., "Low", "Medium", "High"
    status = Column(String, index=True, default="Draft")   # e.g., "Draft", "Resolved", "Verified"
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
