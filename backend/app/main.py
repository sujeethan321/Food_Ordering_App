from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.routers import auth, category, food, order, dashboard, user


app = FastAPI(title="Food Ordering API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    
    
    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(food.router)
app.include_router(order.router)
app.include_router(dashboard.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "Food Ordering API is running"}