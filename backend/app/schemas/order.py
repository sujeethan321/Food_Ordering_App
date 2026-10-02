from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatusEnum

class OrderItemCreate(BaseModel):
    food_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_min(cls, v):
        if v < 1:
            raise ValueError("quantity must be at least 1")
        return v

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, v):
        if not v:
            raise ValueError("order must contain at least one item")
        return v

class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    food_id: int
    food_name: Optional[str] = None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("status", mode="before")
    @classmethod
    def normalize_status(cls, value):
        # Older records may contain lowercase status values.
        if isinstance(value, str):
            for status in OrderStatusEnum:
                if value.strip().casefold() == status.value.casefold():
                    return status.value
        return value

    id: int
    customer_id: int
    total_amount: Decimal
    status: OrderStatusEnum
    created_at: datetime
    items: List[OrderItemResponse]

class OrderStatusUpdate(BaseModel):
    status: OrderStatusEnum
