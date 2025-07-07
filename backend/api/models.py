from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict

class UserBase(BaseModel):
    # React sends fullName ➜ backend keeps username
    username: str = Field(..., alias="fullName", min_length=2,max_length=50)
    email: EmailStr
    avatar: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = Field(None, alias="phoneNumber")

    class Config:
        allow_population_by_field_name = True    # accepts either alias or field name
        orm_mode = True                        
        
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

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

# Accept any dictionary as query
class QueryInput(BaseModel):
    query: Dict[str, Any]

