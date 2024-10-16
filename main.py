from databases import Database
import asyncio

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "postgres"

database = Database(f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost/{POSTGRES_DB}')

async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# Function to select data from a table
async def select_data():
    query = "SELECT * FROM users"
    rows = await database.fetch_all(query)
    for row in rows:
        print(dict(row))  # Prints each row in the result

# Function to insert data into the users table
async def insert_users(name, email, password, phone_number):
    query = """
    INSERT INTO users (name, email, password, phone_number)
    VALUES (:name, :email, :password, :phone_number)
    RETURNING user_id, name, email, password, phone_number
    """
    # Convert phone_number to string
    phone_number = str(phone_number)

    values = {"name": name, "email": email, "password": password, "phone_number": phone_number}
    try:
        result = await database.fetch_one(query=query, values=values)
        print(f"Inserted user ID: {result['user_id']}")
    except Exception as e:
        print(f"Error inserting user: {e}")

# Function to update a user
async def update_users(user_id, name=None, email=None, password=None, phone_number=None):
    query = "UPDATE users SET "
    values = {"user_id": user_id}

    update_fields = []
    if name is not None:
        update_fields.append("name = :name")
        values["name"] = name
    if email is not None:
        update_fields.append("email = :email")
        values["email"] = email
    if password is not None:
        update_fields.append("password = :password")
        values["password"] = password
    if phone_number is not None:
        update_fields.append("phone_number = :phone_number")
        values["phone_number"] = phone_number

    query += ", ".join(update_fields) + " WHERE user_id = :user_id RETURNING *"
    try:
        updated_row = await database.fetch_one(query=query, values=values)
        if updated_row:
            print(f"Updated user: {dict(updated_row)}")
        else:
            print(f"No user found with ID: {user_id}")
    except Exception as e:
        print(f"Error updating user: {e}")

# Function to delete a user
async def delete_users(user_id):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    values = {"user_id": user_id}
    try:
        deleted_row = await database.fetch_one(query=query, values=values)
        if deleted_row:
            print(f"Deleted user: {dict(deleted_row)}")
        else:
            print(f"No user found with ID: {user_id}")
    except Exception as e:
        print(f"Error deleting user: {e}")

# Main function to run async functions
async def main():
    try:
        await connect_db()
        
        # Example operations:
        await insert_users('John Doe', 'john@example.com', 'password123', 1234567890)
        # await select_data()
        # await update_users(1, name="Jane Doe")
        # await delete_users(1)
    finally:
        await disconnect_db()

if __name__ == "__main__":
    asyncio.run(main())
