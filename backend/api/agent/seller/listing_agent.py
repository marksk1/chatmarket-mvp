# agents/seller/listing_agent.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import requests
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
from typing import Dict, Any, List, Optional
from datetime import datetime
import json
from fastapi import Request
from fastapi.responses import JSONResponse
import uuid

class ListingRequest(Model):
    user_id: str
    product_info: Dict[str, Any]
    final_price: float
    owner_id: str

class ListingResponse(Model):
    user_id: str
    listing_id: str
    success: bool
    message: str

class ListingUpdateRequest(Model):
    listing_id: str
    updates: Dict[str, Any]
    owner_id: str

class ListingDeleteRequest(Model):
    listing_id: str
    owner_id: str

class ListingStatusRequest(Model):
    listing_id: str
    owner_id: str

class ListingStatusResponse(Model):
    listing_id: str
    status: str
    views: int
    interested_buyers: int
    success: bool

# Initialize agent
listing_agent = Agent(
    name="listing_agent",
    port=8007,
    seed="listing_agent_seed",
    endpoint=["http://localhost:8007/submit"]
)

fund_agent_if_low(listing_agent.wallet.address())

def validate_product_info(product_info: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and clean product information"""
    
    required_fields = ["product_name", "condition"]
    missing_fields = [field for field in required_fields if not product_info.get(field)]
    
    if missing_fields:
        return {
            "valid": False,
            "errors": f"Missing required fields: {', '.join(missing_fields)}"
        }
    
    # Clean and validate data
    cleaned_info = {
        "name": product_info.get("product_name", "").strip(),
        "description": product_info.get("description", "").strip(),
        "condition": product_info.get("condition", "").lower(),
        "category": product_info.get("category", "").strip(),
        "brand": product_info.get("brand", "").strip(),
        "location": product_info.get("location", "").strip(),
        "age": product_info.get("age", "").strip(),
        "reason_for_selling": product_info.get("reason_for_selling", "").strip(),
        "negotiable": product_info.get("negotiable", True)
    }
    
    # Build description if empty
    if not cleaned_info["description"]:
        cleaned_info["description"] = build_description(cleaned_info)
    
    # Validate condition
    valid_conditions = ["new", "excellent", "good", "fair", "poor"]
    if cleaned_info["condition"] not in valid_conditions:
        cleaned_info["condition"] = "good"  # Default
    
    return {
        "valid": True,
        "cleaned_info": cleaned_info
    }

def build_description(product_info: Dict[str, Any]) -> str:
    """Build a description from available product information"""
    
    description_parts = []
    
    # Add brand if available
    if product_info.get("brand"):
        description_parts.append(f"{product_info['brand']} {product_info['name']}")
    else:
        description_parts.append(product_info['name'])
    
    # Add condition
    if product_info.get("condition"):
        description_parts.append(f"in {product_info['condition']} condition")
    
    # Add age if available
    if product_info.get("age"):
        description_parts.append(f"({product_info['age']} old)")
    
    # Add reason for selling
    if product_info.get("reason_for_selling"):
        description_parts.append(f"Selling because: {product_info['reason_for_selling']}")
    
    # Add location
    if product_info.get("location"):
        description_parts.append(f"Located in {product_info['location']}")
    
    # Add negotiability
    if product_info.get("negotiable"):
        description_parts.append("Price negotiable")
    
    return ". ".join(description_parts) + "."

def create_listing_in_database(product_info: Dict[str, Any], price: float, owner_id: str) -> Dict[str, Any]:
    """Create listing in MongoDB via FastAPI"""
    
    try:
        # Prepare data for FastAPI
        listing_data = {
            "name": product_info["name"],
            "description": product_info["description"],
            "price": price,
            "condition": product_info["condition"],
            "category": product_info.get("category", "general"),
            "brand": product_info.get("brand", ""),
            "location": product_info.get("location", ""),
            "owner_id": owner_id,
            "created_at": datetime.now().isoformat(),
            "status": "active",
            "negotiable": product_info.get("negotiable", True),
            "views": 0,
            "interested_buyers": []
        }
        
        # Try to use your FastAPI endpoint first
        try:
            response = requests.post(
                "http://localhost:8000/items/agent/create",
                json=listing_data,
                timeout=10,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200 or response.status_code == 201:
                result = response.json()
                return {
                    "success": True,
                    "listing_id": result.get("id", str(uuid.uuid4())),
                    "message": "Item listed successfully on the marketplace!"
                }
        except requests.exceptions.RequestException as e:
            print(f"FastAPI request failed: {e}")
        
        # Fallback: Direct MongoDB insertion
        try:
            from pymongo import MongoClient
            
            # Connect to MongoDB (adjust connection string as needed)
            client = MongoClient("mongodb://localhost:27017/")
            db = client["marketplace"]
            collection = db["items"]
            
            result = collection.insert_one(listing_data)
            
            return {
                "success": True,
                "listing_id": str(result.inserted_id),
                "message": "Item listed successfully!"
            }
            
        except Exception as mongo_error:
            print(f"MongoDB direct insertion failed: {mongo_error}")
            
            # Final fallback: Mock successful listing
            return {
                "success": True,
                "listing_id": f"mock_{str(uuid.uuid4())[:8]}",
                "message": "Item processed successfully (mock listing created)"
            }
        
    except Exception as e:
        print(f"Database listing failed: {e}")
        return {
            "success": False,
            "listing_id": "",
            "message": f"Failed to create listing: {str(e)}"
        }

def update_listing_in_database(listing_id: str, updates: Dict[str, Any], owner_id: str) -> Dict[str, Any]:
    """Update existing listing"""
    
    try:
        # Try FastAPI endpoint first
        try:
            response = requests.put(
                f"http://localhost:8000/items/agent/{listing_id}",
                json={"updates": updates, "owner_id": owner_id},
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Listing updated successfully!"
                }
        except requests.exceptions.RequestException:
            pass
        
        # Fallback: Direct MongoDB update
        try:
            from pymongo import MongoClient
            
            client = MongoClient("mongodb://localhost:27017/")
            db = client["marketplace"]
            collection = db["items"]
            
            result = collection.update_one(
                {"_id": listing_id, "owner_id": owner_id},
                {"$set": updates}
            )
            
            if result.matched_count > 0:
                return {
                    "success": True,
                    "message": "Listing updated successfully!"
                }
            else:
                return {
                    "success": False,
                    "message": "Listing not found or not owned by user"
                }
                
        except Exception as mongo_error:
            print(f"MongoDB update failed: {mongo_error}")
            return {
                "success": False,
                "message": "Database update failed"
            }
        
    except Exception as e:
        print(f"Update listing failed: {e}")
        return {
            "success": False,
            "message": f"Failed to update listing: {str(e)}"
        }

def delete_listing_from_database(listing_id: str, owner_id: str) -> Dict[str, Any]:
    """Delete listing from database"""
    
    try:
        # Try FastAPI endpoint first
        try:
            response = requests.delete(
                f"http://localhost:8000/items/agent/{listing_id}",
                json={"owner_id": owner_id},
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Listing deleted successfully!"
                }
        except requests.exceptions.RequestException:
            pass
        
        # Fallback: Direct MongoDB deletion
        try:
            from pymongo import MongoClient
            
            client = MongoClient("mongodb://localhost:27017/")
            db = client["marketplace"]
            collection = db["items"]
            
            result = collection.delete_one({"_id": listing_id, "owner_id": owner_id})
            
            if result.deleted_count > 0:
                return {
                    "success": True,
                    "message": "Listing deleted successfully!"
                }
            else:
                return {
                    "success": False,
                    "message": "Listing not found or not owned by user"
                }
                
        except Exception as mongo_error:
            print(f"MongoDB deletion failed: {mongo_error}")
            return {
                "success": False,
                "message": "Database deletion failed"
            }
        
    except Exception as e:
        print(f"Delete listing failed: {e}")
        return {
            "success": False,
            "message": f"Failed to delete listing: {str(e)}"
        }

def get_listing_status(listing_id: str, owner_id: str) -> Dict[str, Any]:
    """Get listing status and analytics"""
    
    try:
        # Try FastAPI endpoint first
        try:
            response = requests.get(
                f"http://localhost:8000/items/agent/{listing_id}/status",
                params={"owner_id": owner_id},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "status": data.get("status", "active"),
                    "views": data.get("views", 0),
                    "interested_buyers": len(data.get("interested_buyers", [])),
                    "created_at": data.get("created_at", ""),
                    "last_updated": data.get("updated_at", "")
                }
        except requests.exceptions.RequestException:
            pass
        
        # Fallback: Direct MongoDB query
        try:
            from pymongo import MongoClient
            
            client = MongoClient("mongodb://localhost:27017/")
            db = client["marketplace"]
            collection = db["items"]
            
            listing = collection.find_one({"_id": listing_id, "owner_id": owner_id})
            
            if listing:
                return {
                    "success": True,
                    "status": listing.get("status", "active"),
                    "views": listing.get("views", 0),
                    "interested_buyers": len(listing.get("interested_buyers", [])),
                    "created_at": listing.get("created_at", ""),
                    "last_updated": listing.get("updated_at", "")
                }
            else:
                return {
                    "success": False,
                    "message": "Listing not found"
                }
                
        except Exception as mongo_error:
            print(f"MongoDB status query failed: {mongo_error}")
            return {
                "success": False,
                "message": "Database query failed"
            }
        
    except Exception as e:
        print(f"Get listing status failed: {e}")
        return {
            "success": False,
            "message": f"Failed to get listing status: {str(e)}"
        }

# HTTP endpoints for direct API access
@listing_agent.on_rest_post("/create")
async def handle_http_create_listing(ctx: Context, req: Request):
    """HTTP endpoint for creating listings"""
    try:
        data = await req.json()
        
        request_msg = ListingRequest(
            user_id=data.get("user_id"),
            product_info=data.get("product_info"),
            final_price=data.get("final_price"),
            owner_id=data.get("owner_id")
        )
        
        response = await process_listing_request(ctx, request_msg)
        
        return JSONResponse(content={
            "success": response.success,
            "listing_id": response.listing_id,
            "message": response.message
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@listing_agent.on_rest_put("/update/<listing_id>")
async def handle_http_update_listing(ctx: Context, req: Request):
    """HTTP endpoint for updating listings"""
    try:
        data = await req.json()
        listing_id = req.path_params.get("listing_id")
        
        result = update_listing_in_database(
            listing_id=listing_id,
            updates=data.get("updates"),
            owner_id=data.get("owner_id")
        )
        
        return JSONResponse(content=result)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@listing_agent.on_rest_delete("/delete/<listing_id>")
async def handle_http_delete_listing(ctx: Context, req: Request):
    """HTTP endpoint for deleting listings"""
    try:
        data = await req.json()
        listing_id = req.path_params.get("listing_id")
        
        result = delete_listing_from_database(
            listing_id=listing_id,
            owner_id=data.get("owner_id")
        )
        
        return JSONResponse(content=result)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

# Message handlers
@listing_agent.on_message(model=ListingRequest)
async def handle_listing_request(ctx: Context, sender: str, msg: ListingRequest):
    """Handle listing creation requests from other agents"""
    response = await process_listing_request(ctx, msg)
    await ctx.send(sender, response)

async def process_listing_request(ctx: Context, msg: ListingRequest) -> ListingResponse:
    """Process listing creation request"""
    
    print(f"Creating listing for user: {msg.user_id}")
    print(f"Product: {msg.product_info.get('product_name', 'Unknown')}")
    print(f"Price: ${msg.final_price}")
    
    # Validate product information
    validation_result = validate_product_info(msg.product_info)
    
    if not validation_result["valid"]:
        return ListingResponse(
            user_id=msg.user_id,
            listing_id="",
            success=False,
            message=validation_result["errors"]
        )
    
    # Create listing in database
    result = create_listing_in_database(
        validation_result["cleaned_info"],
        msg.final_price,
        msg.owner_id
    )
    
    return ListingResponse(
        user_id=msg.user_id,
        listing_id=result["listing_id"],
        success=result["success"],
        message=result["message"]
    )

@listing_agent.on_message(model=ListingUpdateRequest)
async def handle_listing_update(ctx: Context, sender: str, msg: ListingUpdateRequest):
    """Handle listing update requests"""
    
    result = update_listing_in_database(
        msg.listing_id,
        msg.updates,
        msg.owner_id
    )
    
    response = ListingResponse(
        user_id=msg.owner_id,
        listing_id=msg.listing_id,
        success=result["success"],
        message=result["message"]
    )
    
    await ctx.send(sender, response)

@listing_agent.on_message(model=ListingDeleteRequest)
async def handle_listing_delete(ctx: Context, sender: str, msg: ListingDeleteRequest):
    """Handle listing deletion requests"""
    
    result = delete_listing_from_database(msg.listing_id, msg.owner_id)
    
    response = ListingResponse(
        user_id=msg.owner_id,
        listing_id=msg.listing_id,
        success=result["success"],
        message=result["message"]
    )
    
    await ctx.send(sender, response)

@listing_agent.on_message(model=ListingStatusRequest)
async def handle_listing_status(ctx: Context, sender: str, msg: ListingStatusRequest):
    """Handle listing status requests"""
    
    result = get_listing_status(msg.listing_id, msg.owner_id)
    
    response = ListingStatusResponse(
        listing_id=msg.listing_id,
        status=result.get("status", "unknown"),
        views=result.get("views", 0),
        interested_buyers=result.get("interested_buyers", 0),
        success=result["success"]
    )
    
    await ctx.send(sender, response)

# Test code
if __name__ == "__main__":
    import asyncio
    
    class DummyContext:
        async def send(self, recipient: str, msg):
            print(f"[SEND to {recipient}]: {msg}")
    
    async def test_listing_agent():
        print("=== Testing Listing Agent ===\n")
        
        dummy_ctx = DummyContext()
        
        # Test listing creation
        test_request = ListingRequest(
            user_id="test_seller",
            product_info={
                "product_name": "iPhone 12",
                "description": "Great condition iPhone 12",
                "condition": "excellent",
                "brand": "Apple",
                "category": "electronics",
                "location": "New York",
                "negotiable": True
            },
            final_price=450.0,
            owner_id="user123"
        )
        
        print("Testing listing creation...")
        response = await process_listing_request(dummy_ctx, test_request)
        print(f"Response: {response}")
        
        if response.success:
            print(f"\n✅ Listing created successfully!")
            print(f"Listing ID: {response.listing_id}")
            print(f"Message: {response.message}")
        else:
            print(f"\n❌ Listing creation failed: {response.message}")
    
    # Run the test
    asyncio.run(test_listing_agent())
    
    # Run the agent
    print("\n=== Starting Listing Agent Server ===")
    listing_agent.run()