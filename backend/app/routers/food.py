from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from typing import Optional
import math

from app.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse, PaginatedFoodResponse
from app.core.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/foods", tags=["Foods"])

ALLOWED_SORT_FIELDS = {"price": Food.price, "name": Food.name}

@router.get("/", response_model=PaginatedFoodResponse)
def list_foods(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    is_available: Optional[bool] = None,
    sort: Optional[str] = Query(None, description="price or name"),
    order: Optional[str] = Query("asc", description="asc or desc"),
):
    query = db.query(Food)

    if search:
        query = query.filter(Food.name.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Food.category_id == category_id)
    if is_available is not None:
        query = query.filter(Food.is_available == is_available)

    total = query.count()

    if sort in ALLOWED_SORT_FIELDS:
        column = ALLOWED_SORT_FIELDS[sort]
        query = query.order_by(desc(column) if order == "desc" else asc(column))
    else:
        query = query.order_by(Food.id.asc())

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    total_pages = math.ceil(total / limit) if total > 0 else 1

    return PaginatedFoodResponse(items=items, total=total, page=page, limit=limit, total_pages=total_pages)

@router.get("/{food_id}", response_model=FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food

@router.post("/", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
def create_food(
    food_in: FoodCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    category = db.query(Category).filter(Category.id == food_in.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Category does not exist")

    new_food = Food(**food_in.model_dump())
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

@router.put("/{food_id}", response_model=FoodResponse)
def update_food(
    food_id: int,
    food_in: FoodUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    if food_in.category_id is not None:
        category = db.query(Category).filter(Category.id == food_in.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Category does not exist")

    update_data = food_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(food, field, value)

    db.commit()
    db.refresh(food)
    return food

@router.delete("/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    if food.order_items:
        food.is_available = False
        db.commit()
        return None

    db.delete(food)
    db.commit()
    return None