# agents/seller/conversation_agent.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import requests 
import asyncio 

from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
from typing import Dict, Any, List, Optional
from agent.services.groq_service import GroqService
import json
# from fastapi import Request
# from fastapi.responses import JSONResponse

class SellerQueryMessage(Model):
    user_id: str
    message: str

class ProductInfoMessage(Model):
    user_id: str
    product_info: Dict[str, Any]
    is_complete: bool

class PriceResearchRequest(Model):
    user_id: str
    product_name: str
    suggested_price: float
    product_info: Dict[str, Any]

class PriceResearchResponse(Model):
    user_id: str
    market_price_range: Dict[str, float]
    suggested_price: float
    price_analysis: str
    confidence_score: float

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

class SellerConversationState:
    def __init__(self):
        self.conversations = {}
    
    def get_conversation(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.conversations:
            self.conversations[user_id] = {
                "messages": [],
                "extracted_info": {
                    "product_name": None,
                    "description": None,
                    "condition": None,
                    "suggested_price": None,
                    "category": None,
                    "brand": None,
                    "age": None,
                    "location": None,
                    "reason_for_selling": None,
                    "negotiable": None
                },
                "user_emotion": "neutral",
                "conversation_stage": "greeting",
                "missing_fields": []
            }
        return self.conversations[user_id]
    
    def add_message(self, user_id: str, message: str, is_user: bool = True):
        conv = self.get_conversation(user_id)
        conv["messages"].append({
            "role": "user" if is_user else "assistant",
            "content": message
        })
    
    def update_extracted_info(self, user_id: str, new_info: Dict[str, Any]):
        conv = self.get_conversation(user_id)
        for key, value in new_info.items():
            if value is not None:
                conv["extracted_info"][key] = value

# Initialize agent
seller_conversation_agent = Agent(
    name="seller_conversation_agent",
    port=8005,
    seed="seller_conversation_seed",
    endpoint=["http://localhost:8005/submit"]
)

fund_agent_if_low(seller_conversation_agent.wallet.address())

groq_service = GroqService()
conversation_state = SellerConversationState()

def analyze_seller_emotion_and_intent(message: str, conversation_history: list) -> Dict[str, Any]:
    """Analyze seller's emotional state and intent"""
    
    emotion_prompt = f"""Analyze this seller conversation for emotional state and intent:

Recent messages: {conversation_history[-5:] if conversation_history else []}
Current message: "{message}"

Return ONLY a JSON object:
{{
    "emotion": "excited|frustrated|casual|urgent|confused|happy|disappointed",
    "intent": "quick_sell|maximize_profit|declutter|upgrade|emergency_cash|casual_selling",
    "confidence_level": "high|medium|low",
    "conversation_tone": "formal|casual|friendly|business"
}}"""
    
    try:
        response = groq_service.generate_response(message, emotion_prompt)
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = response[start:end]
            return json.loads(json_str)
    except Exception as e:
        print(f"Seller emotion analysis failed: {e}")
    
    return {
        "emotion": "neutral",
        "intent": "casual_selling",
        "confidence_level": "medium",
        "conversation_tone": "friendly"
    }

def extract_product_information(message: str, current_info: dict, emotion_data: dict) -> dict:
    """Extract product information from seller's message"""
    
    extract_prompt = f"""You are helping a seller list their product. Extract information from this message:

User's message: "{message}"
Current info we have: {current_info}
Seller seems: {emotion_data.get('emotion', 'neutral')} and wants to {emotion_data.get('intent', 'casual_selling')}

Extract product details naturally. Examples:
- "iPhone 12 in good condition" -> product_name: "iPhone 12", condition: "good"
- "laptop for $500" -> product_name: "laptop", suggested_price: 500
- "barely used" -> condition: "excellent"
- "need to sell quickly" -> reason_for_selling: "urgent"

Return ONLY a JSON object:
{{
    "product_name": "specific product name",
    "description": "detailed description",
    "condition": "new|excellent|good|fair|poor",
    "suggested_price": number_or_null,
    "category": "electronics|furniture|clothing|etc",
    "brand": "brand name or null",
    "age": "how old the item is",
    "location": "city/area",
    "reason_for_selling": "why they're selling",
    "negotiable": true_or_false_or_null
}}"""
    
    try:
        response = groq_service.generate_response(message, extract_prompt)
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = response[start:end]
            return json.loads(json_str)
    except Exception as e:
        print(f"Product information extraction failed: {e}")
    
    return {}

def generate_seller_response(conv_data: dict, emotion_data: dict, missing_fields: list) -> str:
    """Generate natural responses for sellers"""
    
    messages = [m['content'] for m in conv_data['messages'][-5:]]
    extracted_info = conv_data['extracted_info']
    
    response_prompt = f"""You are a helpful marketplace assistant helping someone sell their item.

Conversation history: {messages}
What we know about their item: {extracted_info}
Seller's mood: {emotion_data.get('emotion', 'neutral')}
Seller's intent: {emotion_data.get('intent', 'casual_selling')}
Still need to know: {missing_fields}

Generate a natural response that:
1. Acknowledges their item/situation
2. Shows understanding of their selling goals
3. Asks for missing info naturally
4. Matches their tone ({emotion_data.get('conversation_tone', 'friendly')})

Examples:
- If seller seems urgent: "I can help you list that quickly! What condition would you say it's in?"
- If seller wants max profit: "Great! To get you the best price, could you tell me more about the condition?"
- If casual: "Nice! What condition is it in and what price were you thinking?"

Keep it conversational and supportive. Just return the response."""
    
    try:
        response = groq_service.generate_response("", response_prompt)
        return response.strip().strip('"').strip("'")
    except Exception as e:
        print(f"Seller response generation failed: {e}")
        return "I'd love to help you sell that! Could you tell me a bit more about the item?"

# # HTTP endpoint for frontend
# @seller_conversation_agent.on_rest_post("/chat")
# async def handle_http_chat(ctx: Context, req: Request):
#     try:
#         data = await req.json()
#         user_id = data.get("user_id")
#         message = data.get("message")
        
#         if not user_id or not message:
#             return JSONResponse(
#                 status_code=400,
#                 content={"error": "user_id and message are required"}
#             )
        
#         # Process the message
#         query_msg = SellerQueryMessage(user_id=user_id, message=message)
#         response = await process_seller_query(ctx, query_msg)
        
#         return JSONResponse(content={
#             "response": response,
#             "user_id": user_id
#         })
        
#     except Exception as e:
#         return JSONResponse(
#             status_code=500,
#             content={"error": str(e)}
#         )

async def process_seller_query(ctx: Context, msg: SellerQueryMessage) -> str:
    """Process seller query and return response"""
    
    # Store user message
    conversation_state.add_message(msg.user_id, msg.message, is_user=True)
    
    # Get conversation history
    conv = conversation_state.get_conversation(msg.user_id)
    
    # Analyze emotion and intent
    emotion_data = analyze_seller_emotion_and_intent(msg.message, conv['messages'])
    conv['user_emotion'] = emotion_data.get('emotion', 'neutral')
    
    # Extract product information
    extracted_info = extract_product_information(msg.message, conv['extracted_info'], emotion_data)
    
    if extracted_info:
        conversation_state.update_extracted_info(msg.user_id, extracted_info)
        conv = conversation_state.get_conversation(msg.user_id)
    
    # Check required fields
    required_fields = ["product_name", "condition", "suggested_price"]
    
    # Adjust based on seller intent
    if emotion_data.get('intent') == 'quick_sell':
        required_fields = ["product_name", "condition"]  # Price research will help
    elif emotion_data.get('intent') == 'maximize_profit':
        required_fields.extend(["description", "brand"])
    
    missing_fields = [field for field in required_fields if not conv["extracted_info"].get(field)]
    
    if not missing_fields:
        # We have enough info - proceed with price research
        product_info = conv["extracted_info"].copy()
        
        # Send to price research agent
        price_request = PriceResearchRequest(
            user_id=msg.user_id,
            product_name=product_info["product_name"],
            suggested_price=product_info.get("suggested_price", 0),
            product_info=product_info
        )
        
        await ctx.send("price_research_agent", price_request)
        
        response = "Great! I have all the details. Let me research the market price for you..."
        conversation_state.add_message(msg.user_id, response, is_user=False)
        return response
    
    else:
        # Generate natural follow-up
        response = generate_seller_response(conv, emotion_data, missing_fields)
        conversation_state.add_message(msg.user_id, response, is_user=False)
        return response

@seller_conversation_agent.on_message(model=SellerQueryMessage)
async def handle_seller_query(ctx: Context, sender: str, msg: SellerQueryMessage):
    response = await process_seller_query(ctx, msg)
    await ctx.send(msg.user_id, response)

@seller_conversation_agent.on_message(model=PriceResearchResponse)
async def handle_price_research_response(ctx: Context, sender: str, msg: PriceResearchResponse):
    """Handle price research results"""
    
    # Format price analysis for seller
    price_msg = f"""📊 **Market Research Results:**

💰 **Market Price Range:** ${msg.market_price_range.get('min', 0):.2f} - ${msg.market_price_range.get('max', 0):.2f}
🎯 **Suggested Price:** ${msg.suggested_price:.2f}

{msg.price_analysis}

Would you like to list it at the suggested price, or would you prefer a different price?"""
    
    await ctx.send(msg.user_id, price_msg)

@seller_conversation_agent.on_message(model=ListingResponse)
async def handle_listing_response(ctx: Context, sender: str, msg: ListingResponse):
    """Handle listing creation results"""
    
    if msg.success:
        success_msg = f"""✅ **Great! Your item has been listed successfully!**

🆔 **Listing ID:** {msg.listing_id}
📝 **Status:** {msg.message}

Your item is now live on the marketplace. Buyers can find it and contact you. Good luck with your sale! 🎉"""
    else:
        success_msg = f"❌ Sorry, there was an issue listing your item: {msg.message}"
    
    await ctx.send(msg.user_id, success_msg)

# Test code
if __name__ == "__main__":
    import asyncio
    
    class DummyContext:
        async def send(self, recipient: str, msg):
            if recipient == "test_user":
                print(f"Agent: {msg}")
            else:
                print(f"[SEND to {recipient}]: {msg}")
    
    async def interactive_chat():
        print("=== Interactive Chat with Seller Agent ===")
        print("Type 'quit' to exit\n")
        
        dummy_ctx = DummyContext()
        
        while True:
            user_input = input("Seller: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not user_input:
                continue
            
            test_message = SellerQueryMessage(
                user_id="test_seller",
                message=user_input
            )
            
            response = await process_seller_query(dummy_ctx, test_message)
            print(f"Agent: {response}\n")
    
    # Run the agent
    seller_conversation_agent.run()