from fastapi import APIRouter, Depends, HTTPException, status
from db import users_collection
from models import UserCreate, UserOut
from bson import ObjectId
from auth import get_password_hash, get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    result = users_collection.insert_one(user_dict)
    return UserOut(id=str(result.inserted_id), **user_dict)

@router.get("/", response_model=list[UserOut])
def list_users(current_user=Depends(get_current_user)):
    users = users_collection.find()
    return [UserOut(id=str(u["_id"]), **u) for u in users]

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: str, current_user=Depends(get_current_user)):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(id=str(user["_id"]), **user)

@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(get_current_user)):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
