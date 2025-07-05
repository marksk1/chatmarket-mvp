from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os

app = FastAPI()

uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["chat_marketplace"]
collection = db["user"]  # your MongoDB collection

# Define a Pydantic model for validation
class User(BaseModel):
    name: str
    email: str
    password: str

@app.get("/")
async def root():
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        return {"message": "Pinged your deployment. You successfully connected to MongoDB!"}
    except Exception as e:
        return {"message": e}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

# Route to store the item
@app.post("/users")
async def create_user(user: User):
    try:
        user_dict = user.model_dump()  # Convert Pydantic model to dict
        result = collection.insert_one(user_dict)
        return {"id": str(result.inserted_id), "message": "User stored successfully"}
    except Exception as e:
        return {"message": "Something went wrong: {}".format(e)}
    
