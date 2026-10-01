from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal

class FoodCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    image: Optional[str] = None
    is_available: bool = True
    category_id: int

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("name must be at least 2 characters")
        return v

    @field_validator("price")
    @classmethod
    def price_positive(cls, v):
        if v <= 0:
            raise ValueError("price must be greater than 0")
        return v

class FoodUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    image: Optional[str] = None
    is_available: Optional[bool] = None
    category_id: Optional[int] = None

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError("name must be at least 2 characters")
        return v

    @field_validator("price")
    @classmethod
    def price_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("price must be greater than 0")
        return v

class FoodResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    price: Decimal
    image: Optional[str] = None
    is_available: bool
    category_id: int
    created_at: datetime

class PaginatedFoodResponse(BaseModel):
    items: list[FoodResponse]
    total: int
    page: int
    limit: int
    total_pages: int