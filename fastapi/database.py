from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, TIMESTAMP, func
from sqlalchemy.sql import select
from fastapi import HTTPException

# Database configuration
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro2"
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

# Function to select a user by name from the users table
async def get_user(name: str):
    query = "SELECT * FROM users WHERE name = :name"
    return await database.fetch_one(query=query, values={"name": name})

async def update_user(id: int, name: str, age: int, height: float, sex: str, email: str):
    query = """
    UPDATE users 
    SET name = :name, age = :age, height = :height, sex = :sex, email = :email
    WHERE id = :id
    RETURNING id, name, age, height, sex, email, created_at
    """
    values = {"name": name, "age": age, "height": height, "sex": sex, "email": email}
    return await database.fetch_one(query=query, values=values)


# Function to delete a user from the users table
async def delete_user(id: int):
   query = "DELETE FROM users WHERE id = :id RETURNING *"
   return await database.fetch_one(query=query, values={"id": id})
