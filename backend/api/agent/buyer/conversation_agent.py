# agents/buyer/conversation_agent.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import requests 
from uagents import Agent, Context, Model
from typing import Dict, Any, List, Optional
from agent.services.groq_service import GroqService
import json
from typing import Dict, Any, Optional

class BuyerQueryMessage(Model):
    user_id: str
    message: str

class SearchCriteriaMessage(Model):
    user_id: str
    criteria: Dict[str, Any]
    is_complete: bool

class RecommendationRequest(Model):
    user_id: str
    search_results: List[Dict[str, Any]]
    user_context: Dict[str, Any]
    search_criteria: Dict[str, Any]

class RecommendationResponse(Model):
    user_id: str
    recommendations: List[Dict[str, Any]]
    explanation: str
    confidence_score: float

class ConversationState:
    def __init__(self):
        self.conversations = {}  # user_id -> conversation_data
    
    def get_conversation(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.conversations:
            self.conversations[user_id] = {
                "messages": [],
                "extracted_info": {
                    "product_type": None,
                    "budget_min": None,
                    "budget_max": None,
                    "location": None,
                    "timeline": None,
                    "condition": None,
                    "specifications": {},
                    "use_case": None
                },
                "user_emotion": "neutral",
                "conversation_stage": "greeting",  # greeting, exploring, narrowing, searching
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

buyer_conversation_agent = Agent(
    name="buyer_conversation_agent",
    port=8004,
    seed="buyer_conversation_seed",
    endpoint=["http://localhost:8004/submit"]
)

groq_service = GroqService()
conversation_state = ConversationState()

def analyze_user_emotion_and_intent(message: str, conversation_history: list) -> Dict[str, Any]:
    """Analyze user's emotional state and conversation intent"""
    
    emotion_prompt = f"""Analyze this conversation for emotional state and intent:

Recent messages: {conversation_history[-5:] if conversation_history else []}
Current message: "{message}"

Return ONLY a JSON object:
{{
    "emotion": "excited|frustrated|casual|urgent|confused|happy|disappointed",
    "intent": "browsing|specific_need|price_shopping|urgent_purchase|just_looking",
    "confidence_level": "high|medium|low",
    "conversation_tone": "formal|casual|friendly|business"
}}"""
    
    try:
        response = groq_service.generate_response(message, emotion_prompt)
        # Extract JSON from response
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = response[start:end]
            return json.loads(json_str)
    except Exception as e:
        print(f"Emotion analysis failed: {e}")
    
    return {
        "emotion": "neutral",
        "intent": "browsing",
        "confidence_level": "medium",
        "conversation_tone": "friendly"
    }

def extract_information_smartly(message: str, current_info: dict, emotion_data: dict) -> dict:
    """Extract information while being context-aware"""
    
    extract_prompt = f"""You are a helpful shopping assistant. Extract information from this message naturally.

User's message: "{message}"
Current info we have: {current_info}
User seems: {emotion_data.get('emotion', 'neutral')} and {emotion_data.get('intent', 'browsing')}

Extract information naturally. If user mentions something vaguely, try to infer:
- "laptop" could be product_type: "laptop"
- "cheap" could be budget_max: 500
- "good quality" could be condition: "new" or "excellent"
- "need it soon" could be timeline: "urgent"

Return ONLY a JSON object:
{{
    "product_type": "specific product name or category",
    "budget_min": number_or_null,
    "budget_max": number_or_null,
    "location": "city/area or null",
    "timeline": "urgent|soon|flexible|null",
    "condition": "new|used|excellent|any|null",
    "specifications": {{}},
    "use_case": "what they need it for"
}}"""
    
    try:
        response = groq_service.generate_response(message, extract_prompt)
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = response[start:end]
            return json.loads(json_str)
    except Exception as e:
        print(f"Information extraction failed: {e}")
    
    return {}

def generate_natural_response(conv_data: dict, emotion_data: dict, missing_fields: list) -> str:
    """Generate natural, emotion-aware responses"""
    
    messages = [m['content'] for m in conv_data['messages'][-5:]]
    extracted_info = conv_data['extracted_info']
    
    response_prompt = f"""You are a friendly, helpful shopping assistant having a natural conversation.

Conversation history: {messages}
What we know so far: {extracted_info}
User's emotional state: {emotion_data.get('emotion', 'neutral')}
User's intent: {emotion_data.get('intent', 'browsing')}
Missing important info: {missing_fields}

Generate a natural response that:
1. Acknowledges what they said
2. Shows you understand their needs/emotions
3. Asks for missing info in a conversational way
4. Matches their tone ({emotion_data.get('conversation_tone', 'friendly')})

Examples of natural responses:
- If user seems excited: "That sounds great! To help you find the perfect [item], what's your budget range?"
- If user seems frustrated: "I understand that can be frustrating. Let me help you find exactly what you need..."
- If user is casual: "Cool! What kind of price range are you thinking?"
- If user is urgent: "I can help you find that quickly! What's your budget so I can show you the best options?"

Keep it conversational, warm, and helpful. Don't sound robotic.
Just return the response, nothing else."""
    
    try:
        response = groq_service.generate_response("", response_prompt)
        return response.strip().strip('"').strip("'")
    except Exception as e:
        print(f"Response generation failed: {e}")
        return "I'd love to help you find what you're looking for! Could you tell me a bit more about what you have in mind?"

@buyer_conversation_agent.on_message(model=BuyerQueryMessage)
async def handle_buyer_query(ctx: Context, sender: str, msg: BuyerQueryMessage):
    # Store user message
    conversation_state.add_message(msg.user_id, msg.message, is_user=True)
    
    # Get conversation history
    conv = conversation_state.get_conversation(msg.user_id)
    
    # Analyze user emotion and intent
    emotion_data = analyze_user_emotion_and_intent(msg.message, conv['messages'])
    conv['user_emotion'] = emotion_data.get('emotion', 'neutral')
    
    print(f"Emotion analysis: {emotion_data}")
    
    # Extract information using smart context-aware extraction
    extracted_info = extract_information_smartly(msg.message, conv['extracted_info'], emotion_data)
    
    if extracted_info:
        conversation_state.update_extracted_info(msg.user_id, extracted_info)
        conv = conversation_state.get_conversation(msg.user_id)  # Refresh
        print(f"Successfully extracted: {extracted_info}")
    
    # Check if we have enough information (flexible based on user intent)
    required_fields = ["product_type"]
    
    # Adjust requirements based on user intent
    if emotion_data.get('intent') == 'urgent_purchase':
        required_fields.extend(["budget_max"])
    elif emotion_data.get('intent') == 'specific_need':
        required_fields.extend(["budget_min", "budget_max"])
    else:
        required_fields.extend(["budget_max"])  # Just need max budget for browsing
    
    missing_fields = [field for field in required_fields if not conv["extracted_info"].get(field)]
    
    if not missing_fields:
        # We have enough info - search the database
        search_criteria = conv["extracted_info"].copy()
        
        try:
            # Call your FastAPI backend
            response = requests.post(
                "http://localhost:8000/items/agent/search",
                json=search_criteria,
                timeout=10
            )
            
            if response.status_code == 200:
                results = response.json()
                
                # Send to recommendation agent for personalized recommendations
                recommendation_request = RecommendationRequest(
                    user_id=msg.user_id,
                    search_results=results,
                    user_context=conv,
                    search_criteria=search_criteria
                )
                
                await ctx.send(
                    "recommendation_agent",
                    recommendation_request
                )
            else:
                await ctx.send(msg.user_id, "I'm having trouble searching right now. Could you try again in a moment?")
                
        except Exception as e:
            print(f"Search failed: {e}")
            await ctx.send(msg.user_id, "I'm having trouble connecting to our product database. Let me try to help you in another way.")
    
    else:
        # Generate natural, emotion-aware follow-up
        natural_response = generate_natural_response(conv, emotion_data, missing_fields)
        conversation_state.add_message(msg.user_id, natural_response, is_user=False)
        
        await ctx.send(msg.user_id, natural_response)

@buyer_conversation_agent.on_message(model=RecommendationResponse)
async def handle_recommendation_response(ctx: Context, sender: str, msg: RecommendationResponse):
    """Handle recommendations from recommendation agent"""
    
    if not msg.recommendations:
        await ctx.send(msg.user_id, msg.explanation)
        return
    
    # Format recommendations nicely
    result_message = f"{msg.explanation}\n\n"
    
    for i, item in enumerate(msg.recommendations[:3]):  # Show top 3
        result_message += f"🔸 **{item['name']}** - ${item['price']}\n"
        
        if item.get('description'):
            result_message += f"   {item['description'][:100]}...\n"
        
        # Add recommendation reasons
        reasons = item.get('recommendation_reasons', [])
        if reasons:
            result_message += f"   ✓ {reasons[0]}\n"
        
        result_message += "\n"
    
    result_message += "Would you like more details about any of these, or should I search for something else?"
    
    await ctx.send(msg.user_id, result_message)

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
        print("=== Interactive Chat with Enhanced Conversation Agent ===")
        print("Type 'quit' to exit\n")
        
        dummy_ctx = DummyContext()
        
        while True:
            # Get user input
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not user_input:
                continue
            
            # Send message to agent
            test_message = BuyerQueryMessage(
                user_id="test_user",
                message=user_input
            )
            
            await handle_buyer_query(dummy_ctx, "dummy_sender", test_message)
            print()  # Empty line for readability
    
    asyncio.run(interactive_chat())