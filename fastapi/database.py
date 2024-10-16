from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, TIMESTAMP, func
from sqlalchemy.sql import select
from fastapi import HTTPException
from datetime import date

# Database configuration
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

# Initialize database connection
database = Database(DATABASE_URL)

# Connect to the database
async def connect_db():
    await database.connect()
    print("Database connected")

# Disconnect from the database
async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# Function to insert a new user into the users table
async def insert_user(name: str, age: int, height: float, sex: str, email: str):
    query = """
    INSERT INTO users (name, age, height, sex, email)
    VALUES (:name, :age, :height, :sex, :email)
    RETURNING id, name, age, height, sex, email, created_at
    """
    values = {"name": name, "age": age, "height": height, "sex": sex, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function get user by email
async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

# Function to select a user by name from the users table
async def get_user(id: int):
    query = "SELECT * FROM users WHERE id = :id"
    return await database.fetch_one(query=query, values={"id": id})

async def update_user(id: int, name: str, age: int, height: float, sex: str, email: str):
    query = """
    UPDATE users 
    SET name = :name, age = :age, height = :height, sex = :sex, email = :email
    WHERE id = :id
    RETURNING id, name, age, height, sex, email, created_at
    """
    values = {
        "id": id,
        "name": name,
        "age": age,
        "height": height,
        "sex": sex,
        "email": email
    }
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(id: int):
   query = "DELETE FROM users WHERE id = :id RETURNING *"
   return await database.fetch_one(query=query, values={"id": id})

# Water function

# read water end point
async def get_water_data(user_id: int):
    query = """
    SELECT entry_date, SUM(water) as total_water
    FROM water_data
    WHERE user_id = :user_id
    GROUP BY entry_date
    ORDER BY entry_date DESC
    LIMIT 7
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})

# Upsert water intake data
async def upsert_water_data(user_id: int, entry_date: date, water: float):
    query = """
    INSERT INTO water_data (user_id, entry_date, water)
    VALUES (:user_id, :entry_date, :water)
    ON CONFLICT (user_id, entry_date) 
    DO UPDATE SET water = EXCLUDED.water
    RETURNING *
    """
    values = {"user_id": user_id, "entry_date": entry_date, "water": water}
    return await database.fetch_one(query=query, values=values)

# Function to delete water intake data
async def delete_water_data(user_id: int, entry_date: str):  # Ensure entry_date is in the correct format
    query = "DELETE FROM water_data WHERE user_id = :user_id AND entry_date = :entry_date RETURNING *"
    values = {"user_id": user_id, "entry_date": entry_date}
    return await database.fetch_one(query=query, values=values)

# Calorie function

# Read calorie data for a user
async def get_calorie_data(user_id: int):
    query = """
    SELECT entry_date, intake_cal, burned_cal, dif_cal
    FROM calorie_data
    WHERE user_id = :user_id
    ORDER BY entry_date DESC
    LIMIT 7
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})

# Upsert calorie intake data
async def upsert_calorie_data(user_id: int, entry_date: date, intake_cal: float, burned_cal: float, dif_cal: float):
    query = """
    INSERT INTO calorie_data (user_id, entry_date, intake_cal, burned_cal, dif_cal)
    VALUES (:user_id, :entry_date, :intake_cal, :burned_cal, :dif_cal)
    ON CONFLICT (user_id, entry_date) 
    DO UPDATE SET 
        intake_cal = EXCLUDED.intake_cal,
        burned_cal = EXCLUDED.burned_cal,
        dif_cal = EXCLUDED.dif_cal
    RETURNING *
    """
    values = {
        "user_id": user_id,
        "entry_date": entry_date,
        "intake_cal": intake_cal,
        "burned_cal": burned_cal,
        "dif_cal": dif_cal
    }
    return await database.fetch_one(query=query, values=values)

# Function to delete calorie intake data
async def delete_calorie_data(user_id: int, entry_date: date):
    query = """
    DELETE FROM calorie_data WHERE user_id = :user_id AND entry_date = :entry_date RETURNING *
    """
    values = {"user_id": user_id, "entry_date": entry_date}
    return await database.fetch_one(query=query, values=values)

# Exercise functions

# Read exercise data
async def get_exercise_data(user_id: int):
    query = """
    SELECT entry_date, SUM(exercise) as total_exercise
    FROM exercise_data
    WHERE user_id = :user_id
    GROUP BY entry_date
    ORDER BY entry_date DESC
    LIMIT 7
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})

# Upsert exercise data
async def upsert_exercise_data(user_id: int, entry_date: date, exercise: float):
    query = """
    INSERT INTO exercise_data (user_id, entry_date, exercise)
    VALUES (:user_id, :entry_date, :exercise)
    ON CONFLICT (user_id, entry_date) 
    DO UPDATE SET exercise = EXCLUDED.exercise
    RETURNING *
    """
    values = {"user_id": user_id, "entry_date": entry_date, "exercise": exercise}
    return await database.fetch_one(query=query, values=values)

# Function to delete exercise data
async def delete_exercise_data(user_id: int, entry_date: date):
    query = """
    DELETE FROM exercise_data WHERE user_id = :user_id AND entry_date = :entry_date RETURNING *
    """
    values = {"user_id": user_id, "entry_date": entry_date}
    return await database.fetch_one(query=query, values=values)