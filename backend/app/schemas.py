from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field

class AdvisoryBase(BaseModel):
    crop: str = Field(..., min_length=2, max_length=100, description="The crop related to the advisory (e.g., Potato)")
    query: str = Field(..., min_length=5, description="The query/problem detail from the farmer")
    advice: Optional[str] = Field(default=None, description="The generated advice or solution")
    region: str = Field(..., min_length=2, max_length=100, description="The region/district in Uttarakhand")
    severity: str = Field(..., pattern="^(Low|Medium|High)$", description="Severity level: Low, Medium, or High")
    status: str = Field(default="Draft", pattern="^(Draft|Resolved|Verified)$", description="Status: Draft, Resolved, or Verified")

class AdvisoryCreate(AdvisoryBase):
    pass

class AdvisoryUpdate(BaseModel):
    crop: str = Field(..., min_length=2, max_length=100)
    query: str = Field(..., min_length=5)
    advice: str = Field(..., min_length=5)
    region: str = Field(..., min_length=2, max_length=100)
    severity: str = Field(..., pattern="^(Low|Medium|High)$")
    status: str = Field(..., pattern="^(Draft|Resolved|Verified)$")

class AdvisoryPatch(BaseModel):
    crop: Optional[str] = Field(None, min_length=2, max_length=100)
    query: Optional[str] = Field(None, min_length=5)
    advice: Optional[str] = Field(None, min_length=5)
    region: Optional[str] = Field(None, min_length=2, max_length=100)
    severity: Optional[str] = Field(None, pattern="^(Low|Medium|High)$")
    status: Optional[str] = Field(None, pattern="^(Draft|Resolved|Verified)$")

class AdvisoryResponse(BaseModel):
    id: int
    crop: str
    query: str
    advice: str
    region: str
    severity: str
    status: str
    created_at: datetime
    updated_at: datetime

    # Enable support for ORM model mapping (Pydantic V2)
    model_config = ConfigDict(from_attributes=True)

class AdvisoryStats(BaseModel):
    total_count: int
    by_crop: Dict[str, int]
    by_region: Dict[str, int]
    by_severity: Dict[str, int]

class UserCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=100, pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6)
    role: Optional[str] = Field(default="Supervisor")

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5, max_length=100, pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordReset(BaseModel):
    email: str = Field(..., min_length=5, max_length=100, pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    name: str = Field(..., min_length=2, max_length=100)
    new_password: str = Field(..., min_length=6)
