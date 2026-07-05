from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    role = Column(String, index=True, default="Supervisor")
    created_at = Column(DateTime, server_default=func.now())

    advisories = relationship("Advisory", back_populates="creator", cascade="all, delete-orphan")

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

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator = relationship("User", back_populates="advisories")
