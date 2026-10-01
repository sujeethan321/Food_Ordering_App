from pydantic import BaseModel
from decimal import Decimal
from typing import List

class DashboardStats(BaseModel):
    total_foods: int
    total_categories: int
    total_customers: int
    total_orders: int
    total_revenue: Decimal
    pending_orders: int
    delivered_orders: int

class PopularFoodItem(BaseModel):
    food_id: int
    food_name: str
    total_quantity_ordered: int