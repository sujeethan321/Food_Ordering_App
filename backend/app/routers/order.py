from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatusEnum
from app.models.food import Food
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse, OrderStatusUpdate
from app.core.deps import get_current_user, require_admin

router = APIRouter(prefix="/orders", tags=["Orders"])

def _build_order_response(order: Order) -> OrderResponse:
    """Attach food names to items for a friendlier response."""
    items = []
    for item in order.items:
        items.append(OrderItemResponse(
            id=item.id,
            food_id=item.food_id,
            food_name=item.food.name if item.food else None,
            quantity=item.quantity,
            unit_price=item.unit_price,
            subtotal=item.subtotal,
        ))
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        total_amount=order.total_amount,
        status=order.status,
        created_at=order.created_at,
        items=items,
    )

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order_items = []
    total_amount = 0

    # Validate every item BEFORE creating anything — don't partially create an order
    for item_in in order_in.items:
        food = db.query(Food).filter(Food.id == item_in.food_id).first()
        if not food:
            raise HTTPException(status_code=404, detail=f"Food with id {item_in.food_id} not found")
        if not food.is_available:
            raise HTTPException(status_code=400, detail=f"'{food.name}' is currently unavailable")

        # Server calculates everything — never trust a price the frontend might send
        unit_price = food.price
        subtotal = unit_price * item_in.quantity
        total_amount += subtotal

        order_items.append({
            "food_id": food.id,
            "quantity": item_in.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal,
        })

        new_order = Order(
        customer_id=current_user.id,
        total_amount=total_amount,
        status=OrderStatusEnum.pending.value,
    )
    db.add(new_order)
    db.flush()  # get new_order.id before creating items

    for item_data in order_items:
        db.add(OrderItem(order_id=new_order.id, **item_data))

    db.commit()
    db.refresh(new_order)
    return _build_order_response(new_order)

@router.get("/my-orders", response_model=List[OrderResponse])
def list_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = db.query(Order).filter(Order.customer_id == current_user.id).order_by(Order.id.desc()).all()
    return [_build_order_response(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role.value != "admin" and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return _build_order_response(order)

# ---- Admin endpoints ----

@router.get("/", response_model=List[OrderResponse])
def list_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return [_build_order_response(o) for o in orders]

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

        order.status = update.status.value
    db.commit()
    db.refresh(order)
    return _build_order_response(order)