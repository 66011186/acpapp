from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from database import * 
import logging

logger = logging.getLogger("uvicorn")

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    age: int
    height: float
    sex: str
    email: str

class User(BaseModel):
    id: int
    name: str
    age: int
    height: float
    sex: str
    email: str
    created_at: datetime

class UserUpdate(BaseModel):
    name: Optional[str]
    age: Optional[int]
    height: Optional[float]
    sex: Optional[str]
    email: Optional[str]

class WaterIntake(BaseModel):
    entry_date: date  # This will enforce a date format
    water: float

# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    # Check if the email already exists
    existing_user = await get_user_by_email(user.email)  # You need to implement this function
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    result = await insert_user(user.name, user.age, user.height, user.sex, user.email)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    
    return result

# Endpoint to get a user by user_id
@router.get("/users/{id}", response_model=User)
async def read_user(id: int):
   result = await get_user(id)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   return result


@router.delete("/users/{id}")
async def delete_user_endpoint(id: int):
    result = await delete_user(id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint to update a user by user_id
@router.put("/users/{id}", response_model=User)
async def update_user_endpoint(id: int, user: UserUpdate):
    result = await update_user(
        id=id,                    # Pass the id from the URL
        name=user.name,
        age=user.age,
        height=user.height,
        sex=user.sex,
        email=user.email
    )
    
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return result

# Water function

# read water

@router.get("/water_data/{user_id}")
async def get_water_data(user_id: int):
    # Your logic to fetch the last 7 water entries for the given user_id
    # For example:
    query = f"""
    SELECT entry_date, SUM(water) as total_water
    FROM water_data
    WHERE user_id = {user_id}
    GROUP BY entry_date
    ORDER BY entry_date DESC
    LIMIT 7
    """
    results = await database.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="User data not found")
    return results

# Submit water intake data
@router.post("/water_data/{user_id}", response_model=WaterIntake)
async def submit_water_data(user_id: int, water_intake: WaterIntake):
    # Check if user exists before upserting water data
    existing_user = await get_user(user_id)  # Ensure you have this function in database.py

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await upsert_water_data(user_id, water_intake.entry_date, water_intake.water)
    if result is None:
        raise HTTPException(status_code=400, detail="Error saving water intake data")
    
    return result
# Endpoint to delete water intake data
@router.delete("/water_data/{user_id}/{entry_date}")
async def delete_water_data(user_id: int, entry_date: str):
    result = await delete_water_data(user_id, entry_date)
    if result is None:
        raise HTTPException(status_code=404, detail="Water data not found for the given date")
    return {"detail": "Water data deleted"}