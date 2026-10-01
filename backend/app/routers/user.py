from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User, RoleEnum, AccountStatusEnum
from app.schemas.user import UserResponse
from app.core.deps import require_admin
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Customer Management"])

class StatusUpdate(BaseModel):
    account_status: AccountStatusEnum

@router.get("/", response_model=List[UserResponse])
def list_customers(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    search: Optional[str] = Query(None, description="Search by name or email"),
):
    query = db.query(User).filter(User.role == RoleEnum.customer)

    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )

    return query.all()

@router.get("/{user_id}", response_model=UserResponse)
def get_customer(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id, User.role == RoleEnum.customer).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")
    return user

@router.put("/{user_id}/status", response_model=UserResponse)
def update_customer_status(
    user_id: int,
    update: StatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id, User.role == RoleEnum.customer).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    user.account_status = update.account_status
    db.commit()
    db.refresh(user)
    return user