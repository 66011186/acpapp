from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as user_router  # Adjusted import path

app = FastAPI()

# CORS Middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the user router with a prefix
app.include_router(user_router, prefix="/api/users")

# Optional: Add a root path
@app.get("/")
async def root():
    return {"message": "Welcome to the API"}
