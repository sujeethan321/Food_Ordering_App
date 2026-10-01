from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.user import RoleEnum, AccountStatusEnum

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    role: RoleEnum
    account_status: AccountStatusEnum
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"