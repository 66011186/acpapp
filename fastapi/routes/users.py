from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import * 

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

# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
   # Check if the username already exists
   existing_user = await get_user(user.name)
   if existing_user:
       raise HTTPException(status_code=400, detail="Username already exists")


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
   result = await update_user(user.name, user.age, user.height, user.sex, user.email)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   return result