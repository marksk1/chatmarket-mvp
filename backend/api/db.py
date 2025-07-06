from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os

from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["chat_marketplace"]

users_collection = db["users"]
items_collection = db["items"]