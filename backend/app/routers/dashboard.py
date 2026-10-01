from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.food import Food
from app.models.category import Category
from app.models.order import Order, OrderItem
from app.schemas.dashboard import DashboardStats, PopularFoodItem
from app.core.deps import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_foods = db.query(Food).count()
    total_categories = db.query(Category).count()
    total_customers = db.query(User).filter(User.role == RoleEnum.customer).count()
    total_orders = db.query(Order).count()

    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.status != "Cancelled"
    ).scalar() or 0

    pending_orders = db.query(Order).filter(Order.status == "Pending").count()
    delivered_orders = db.query(Order).filter(Order.status == "Delivered").count()

    return DashboardStats(
        total_foods=total_foods,
        total_categories=total_categories,
        total_customers=total_customers,
        total_orders=total_orders,
        total_revenue=total_revenue,
        pending_orders=pending_orders,
        delivered_orders=delivered_orders,
    )

@router.get("/popular-foods", response_model=List[PopularFoodItem])
def get_popular_foods(
    limit: int = 5,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    results = (
        db.query(
            Food.id.label("food_id"),
            Food.name.label("food_name"),
            func.sum(OrderItem.quantity).label("total_quantity_ordered"),
        )
        .join(OrderItem, OrderItem.food_id == Food.id)
        .group_by(Food.id, Food.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )

    return [
        PopularFoodItem(food_id=r.food_id, food_name=r.food_name, total_quantity_ordered=r.total_quantity_ordered)
        for r in results
    ]