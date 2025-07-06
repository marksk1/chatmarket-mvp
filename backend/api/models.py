from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserOut(UserBase):
    id: str

class UserInDB(UserBase):
    hashed_password: str
    id: Optional[str]  # Must be included for ownership

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    images: Optional[List[str]] = None
    owner_id: Optional[str] = None  # Link to MongoDB _id of the user

class ItemOut(Item):
    id: str
