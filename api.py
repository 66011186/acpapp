from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Define a Pydantic model for info
class Info(BaseModel):
    name: str
    water: int
    cal: int
    exercise: int
    sleep: int

# In-memory database (rename to avoid conflict with the model)
infos_db = {}

@app.get("/")
def read_root():
    return {"Hello": "World"}

# GET method to read info by info_id
@app.get("/infos/{info_id}")
def read_item(info_id: int, q: Union[str, None] = None):
    if info_id in infos_db:
        return {"info_id": info_id, "info": infos_db[info_id], "q": q}
    raise HTTPException(status_code=404, detail="Info not found")

# POST method to create a new info
@app.post("/infos/{info_id}")
def create_info(info_id: int, info: Info):
    if info_id in infos_db:
        raise HTTPException(status_code=400, detail="Info already exists")
    infos_db[info_id] = info
    return {"info_id": info_id, "info": info}

# PUT method to update an existing info
@app.put("/infos/{info_id}")
def update_item(info_id: int, info: Info):
    if info_id not in infos_db:
        raise HTTPException(status_code=404, detail="Info not found")
    infos_db[info_id] = info
    return {"info_id": info_id, "info": info}

# DELETE method to delete info
@app.delete("/infos/{info_id}")
def delete_item(info_id: int):
    if info_id not in infos_db:
        raise HTTPException(status_code=404, detail="Info not found")
    del infos_db[info_id]
    return {"detail": "Info deleted"}
