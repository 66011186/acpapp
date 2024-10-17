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

class CalorieIntake(BaseModel):
    entry_date: date
    intake_cal: float
    burned_cal: float
    dif_cal: Optional[float] = None

class ExerciseData(BaseModel):
    entry_date: date  # This will enforce a date format
    exercise: float   # Exercise hours

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

# Endpoint to get calorie data for a user
@router.get("/calorie_data/{user_id}")
async def get_calorie_data(user_id: int):
    query = f"""
    SELECT entry_date, intake_cal, burned_cal, dif_cal
    FROM calorie_data
    WHERE user_id = {user_id}
    ORDER BY entry_date DESC
    LIMIT 7
    """
    results = await database.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="No calorie data found for this user")
    return results

# Endpoint to submit calorie intake data
@router.post("/calorie_data/{user_id}", response_model=CalorieIntake)
async def submit_calorie_data(user_id: int, calorie_intake: CalorieIntake):
    # Check if user exists before upserting calorie data
    existing_user = await get_user(user_id)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate dif_cal
    dif_cal = calorie_intake.intake_cal - calorie_intake.burned_cal

    # Upsert calorie data
    result = await upsert_calorie_data(
        user_id=user_id,
        entry_date=calorie_intake.entry_date,
        intake_cal=calorie_intake.intake_cal,
        burned_cal=calorie_intake.burned_cal,
        dif_cal=dif_cal  # Pass the calculated value
    )
    if result is None:
        raise HTTPException(status_code=400, detail="Error saving calorie data")

    return result

# Endpoint to delete calorie intake data
@router.delete("/calorie_data/{user_id}/{entry_date}")
async def delete_calorie_data(user_id: int, entry_date: date):
    result = await delete_calorie_data(user_id, entry_date)
    if result is None:
        raise HTTPException(status_code=404, detail="Calorie data not found for the given date")
    return {"detail": "Calorie data deleted"}

# Endpoint to get exercise data for a user
@router.get("/exercise_data/{user_id}")
async def get_exercise_data(user_id: int):
    query = """
    SELECT entry_date, SUM(exercise) as total_exercise
    FROM exercise_data
    WHERE user_id = :user_id
    GROUP BY entry_date
    ORDER BY entry_date DESC
    LIMIT 7
    """
    results = await database.fetch_all(query=query, values={"user_id": user_id})
    if not results:
        raise HTTPException(status_code=404, detail="No exercise data found for this user")
    return results

# Endpoint to submit exercise data
@router.post("/exercise_data/{user_id}", response_model=ExerciseData)
async def submit_exercise_data(user_id: int, exercise_data: ExerciseData):
    # Check if user exists before upserting exercise data
    existing_user = await get_user(user_id)  # Ensure you have this function in database.py

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await upsert_exercise_data(
        user_id=user_id,
        entry_date=exercise_data.entry_date,
        exercise=exercise_data.exercise
    )
    if result is None:
        raise HTTPException(status_code=400, detail="Error saving exercise data")

    return result

# Endpoint to delete exercise data
@router.delete("/exercise_data/{user_id}/{entry_date}")
async def delete_exercise_data(user_id: int, entry_date: date):
    result = await delete_exercise_data(user_id, entry_date)
    if result is None:
        raise HTTPException(status_code=404, detail="Exercise data not found for the given date")
    return {"detail": "Exercise data deleted"}