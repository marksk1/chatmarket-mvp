from typing import List
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from db import items_collection
from bson import ObjectId
from models import Item, ItemOut, UserInDB, QueryInput
from s3 import upload_image_to_s3
from auth import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

# ✅ PUBLIC: List all items
@router.get("/", response_model=list[ItemOut])
def list_items():
    items = items_collection.find()
    return [ItemOut(id=str(i["_id"]), **i) for i in items]

# ✅ PUBLIC: List filtered items
@router.post("/query", response_model=None)
def query_items(input_data: QueryInput):
    try:
        # Run the user-provided query
        items = list(items_collection.aggregate(input_data.query))
        for item in items:
            if item["_id"]:
                item["_id"] = str(item["_id"])
        return items
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ✅ PUBLIC: Get item by ID
@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: str):
    item = items_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemOut(id=str(item["_id"]), **item)

# 🔐 AUTH: Create item with image
@router.post("/", response_model=ItemOut)
async def create_item(
    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    files: List[UploadFile] = File(...),
    current_user: UserInDB = Depends(get_current_user)
):
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    image_urls = []

    for file in files:
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file.filename}")
        image_url = upload_image_to_s3(file.file, file.filename, file.content_type)
        image_urls.append(image_url)

    item_data = {
        "name": name,
        "description": description,
        "price": price,
        "images": image_urls,
        "owner_id": str(current_user.id)
    }

    result = items_collection.insert_one(item_data)
    return ItemOut(id=str(result.inserted_id), **item_data)

# 🔐 AUTH: Update item only if owner
@router.put("/{item_id}", response_model=ItemOut)
def update_item(item_id: str, item: Item, current_user: UserInDB = Depends(get_current_user)):
    existing = items_collection.find_one({"_id": ObjectId(item_id), "owner_id": str(current_user.id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")

    update_data = item.dict(exclude_unset=True)
    items_collection.update_one({"_id": ObjectId(item_id)}, {"$set": update_data})
    updated = items_collection.find_one({"_id": ObjectId(item_id)})
    return ItemOut(id=str(updated["_id"]), **updated)

# 🔐 AUTH: Delete item only if owner
@router.delete("/{item_id}")
def delete_item(item_id: str, current_user: UserInDB = Depends(get_current_user)):
    result = items_collection.delete_one({"_id": ObjectId(item_id), "owner_id": str(current_user.id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")
    return {"message": "Item deleted"}
