from databases import Database

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "postgres"

# Corrected connection URL
database = Database(f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost/{POSTGRES_DB}')

async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# Function to insert a new user into the users table
async def insert_user(name: str, email: str, password: str, phone_number: int):
    query = """
    INSERT INTO users (name, email, password, phone_number)
    VALUES (:name, :email, :password, :phone_number)
    RETURNING user_id, name, email, password, phone_number, created_at
    """
    values = {
        "name": name,
        "email": email,
        "password": password,
        "phone_number": phone_number
    }
    return await database.fetch_one(query=query, values=values)

# Function to get a user by user_id
async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to update a user in the users table
async def update_user(user_id: int, name: str, email: str, password: str, phone_number: int):
    query = """
    UPDATE users
    SET name = :name, email = :email, password = :password, phone_number = :phone_number
    WHERE user_id = :user_id
    RETURNING user_id, name, email, password, phone_number, created_at
    """
    values = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": password,
        "phone_number": phone_number
    }
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})
