from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # Ensure your database functions are correctly imported

app = FastAPI()

# Pydantic model for user creation
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone_number: int

# Pydantic model for user update
class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    password: Optional[str]
    phone_number: Optional[int]  # Ensure consistency with the type in UserCreate

# Pydantic model for user response
class User(BaseModel):
    user_id: int  # Fixed typo from 'cutomer_id'
    name: str
    email: str
    password: str
    phone_number: int
    created_at: datetime

# Connect to the database on startup
@app.on_event("startup")
async def startup():
    await connect_db()

# Disconnect from the database on shutdown
@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

# Endpoint to create a new user
@app.post("/users/", response_model=User)
async def create_user(user: UserCreate):
    result = await insert_user(user.name, user.email, user.password, user.phone_number)  # Use user object
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint to get a user by user_id
@app.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update a user
@app.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):  # Match with UserUpdate model
    result = await update_user(user_id, user.name, user.email, user.password, user.phone_number)  # Use user object
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete a user
@app.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}
