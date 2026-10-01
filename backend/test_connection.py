from app.database import engine
from app import models

try:
    with engine.connect() as conn:
        print("✅ Database connection successful!")
except Exception as e:
    print("❌ Connection failed:", e)