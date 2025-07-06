from fastapi import APIRouter, HTTPException
from db import items_collection
from models import Item, ItemOut
from bson import ObjectId

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemOut)
def create_item(item: Item):
    result = items_collection.insert_one(item.dict())
    return ItemOut(id=str(result.inserted_id), **item.dict())

@router.get("/", response_model=list[ItemOut])
def list_items():
    items = items_collection.find()
    return [ItemOut(id=str(i["_id"]), **i) for i in items]

@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: str):
    item = items_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemOut(id=str(item["_id"]), **item)

@router.put("/{item_id}", response_model=ItemOut)
def update_item(item_id: str, item: Item):
    result = items_collection.update_one(
        {"_id": ObjectId(item_id)}, {"$set": item.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    updated = items_collection.find_one({"_id": ObjectId(item_id)})
    return ItemOut(id=str(updated["_id"]), **updated)

@router.delete("/{item_id}")
def delete_item(item_id: str):
    result = items_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}
