# agents/buyer/recommendation_agent.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from uagents import Agent, Context, Model
from agent.services.groq_service import GroqService
import json
from typing import Dict, Any, List, Optional

class RecommendationRequest(Model):
    user_id: str
    search_results: List[Dict[str, Any]]
    user_context: Dict[str, Any]  # includes extracted_info, emotion, conversation history
    search_criteria: Dict[str, Any]

class RecommendationResponse(Model):
    user_id: str
    recommendations: List[Dict[str, Any]]
    explanation: str
    confidence_score: float

class RecommendationEngine:
    def __init__(self):
        self.groq_service = GroqService()
    
    def analyze_user_preferences(self, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user preferences from conversation context"""
        
        messages = user_context.get('messages', [])
        emotion = user_context.get('user_emotion', 'neutral')
        extracted_info = user_context.get('extracted_info', {})
        
        preference_prompt = f"""Analyze user preferences from this conversation:

Messages: {[m['content'] for m in messages[-10:]]}
Current emotion: {emotion}
Extracted requirements: {extracted_info}

Determine user's preferences and priorities:
{{
    "price_sensitivity": "high|medium|low",
    "quality_priority": "high|medium|low",
    "brand_preference": "specific|flexible|no_preference",
    "urgency_level": "urgent|moderate|flexible",
    "feature_priorities": ["performance", "portability", "battery", "display"],
    "risk_tolerance": "conservative|moderate|adventurous",
    "value_seeking": "bargain_hunter|value_conscious|premium_seeker"
}}

Return only JSON."""
        
        try:
            response = self.groq_service.generate_response("", preference_prompt)
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end != 0:
                return json.loads(response[start:end])
        except Exception as e:
            print(f"Preference analysis failed: {e}")
        
        return {
            "price_sensitivity": "medium",
            "quality_priority": "medium",
            "urgency_level": "moderate",
            "value_seeking": "value_conscious"
        }
    
    def score_items(self, items: List[Dict], user_preferences: Dict, search_criteria: Dict) -> List[Dict]:
        """Score and rank items based on user preferences"""
        
        scored_items = []
        
        for item in items:
            score = 0
            reasons = []
            
            # Price scoring
            budget_max = search_criteria.get('budget_max', float('inf'))
            budget_min = search_criteria.get('budget_min', 0)
            price = item.get('price', 0)
            
            if budget_min <= price <= budget_max:
                if user_preferences.get('price_sensitivity') == 'high':
                    # Prefer cheaper options
                    price_score = max(0, (budget_max - price) / budget_max * 30)
                    if price < budget_max * 0.7:
                        reasons.append(f"Great value at ${price}")
                elif user_preferences.get('price_sensitivity') == 'low':
                    # Don't penalize higher prices as much
                    price_score = 25
                    if price > budget_max * 0.8:
                        reasons.append("Premium option with higher quality")
                else:
                    # Balanced approach
                    price_score = 20
                    if budget_min <= price <= budget_max * 0.8:
                        reasons.append(f"Well-priced at ${price}")
                
                score += price_score
            
            # Product match scoring
            product_type = search_criteria.get('product_type', '').lower()
            item_name = item.get('name', '').lower()
            
            if product_type and product_type in item_name:
                score += 25
                reasons.append(f"Matches your {product_type} requirement")
            
            # Description relevance
            description = item.get('description', '').lower()
            use_case = search_criteria.get('use_case', '').lower()
            
            if use_case and use_case in description:
                score += 15
                reasons.append(f"Suitable for {use_case}")
            
            # Condition preference
            condition = search_criteria.get('condition')
            if condition and condition in description:
                score += 10
                reasons.append(f"Available in {condition} condition")
            
            # Add item with score
            scored_items.append({
                **item,
                'recommendation_score': score,
                'recommendation_reasons': reasons
            })
        
        # Sort by score
        scored_items.sort(key=lambda x: x.get('recommendation_score', 0), reverse=True)
        return scored_items
    
    def generate_personalized_explanation(self, top_items: List[Dict], user_preferences: Dict, user_context: Dict) -> str:
        """Generate personalized explanation for recommendations"""
        
        emotion = user_context.get('user_emotion', 'neutral')
        urgency = user_preferences.get('urgency_level', 'moderate')
        
        explanation_prompt = f"""Generate a personalized explanation for these recommendations:

User emotion: {emotion}
User urgency: {urgency}
User preferences: {user_preferences}

Top recommendations:
{[{
    'name': item['name'], 
    'price': item['price'], 
    'reasons': item.get('recommendation_reasons', [])
} for item in top_items[:3]]}

Create a warm, helpful explanation that:
1. Acknowledges their needs and emotions
2. Explains why these are good matches
3. Gives confidence in the recommendations
4. Matches their urgency level

Keep it conversational and helpful, not robotic.
Just return the explanation text."""
        
        try:
            response = self.groq_service.generate_response("", explanation_prompt)
            return response.strip().strip('"').strip("'")
        except Exception as e:
            print(f"Explanation generation failed: {e}")
            return "I've found some great options that match what you're looking for!"

recommendation_agent = Agent(
    name="recommendation_agent",
    port=8005,
    seed="recommendation_agent_seed",
    endpoint=["http://localhost:8005/submit"]
)

recommendation_engine = RecommendationEngine()

@recommendation_agent.on_message(model=RecommendationRequest)
async def handle_recommendation_request(ctx: Context, sender: str, msg: RecommendationRequest):
    """Process recommendation request and return personalized recommendations"""
    
    try:
        # Analyze user preferences
        user_preferences = recommendation_engine.analyze_user_preferences(msg.user_context)
        print(f"User preferences: {user_preferences}")
        
        # Score and rank items
        if not msg.search_results:
            # No results found
            response = RecommendationResponse(
                user_id=msg.user_id,
                recommendations=[],
                explanation="I couldn't find any items matching your criteria right now. Would you like me to expand the search or try different parameters?",
                confidence_score=0.0
            )
        else:
            # Score items
            scored_items = recommendation_engine.score_items(
                msg.search_results, 
                user_preferences, 
                msg.search_criteria
            )
            
            # Get top recommendations
            top_recommendations = scored_items[:5]  # Top 5 recommendations
            
            # Generate explanation
            explanation = recommendation_engine.generate_personalized_explanation(
                top_recommendations, 
                user_preferences, 
                msg.user_context
            )
            
            # Calculate confidence score
            confidence_score = min(1.0, len(top_recommendations) / 5 * 0.8 + 0.2)
            
            response = RecommendationResponse(
                user_id=msg.user_id,
                recommendations=top_recommendations,
                explanation=explanation,
                confidence_score=confidence_score
            )
        
        # Send response back to conversation agent
        await ctx.send(sender, response)
        
    except Exception as e:
        print(f"Recommendation processing failed: {e}")
        
        # Send error response
        error_response = RecommendationResponse(
            user_id=msg.user_id,
            recommendations=[],
            explanation="I'm having trouble processing recommendations right now. Let me show you the basic search results instead.",
            confidence_score=0.0
        )
        await ctx.send(sender, error_response)

if __name__ == "__main__":
    print("Starting Recommendation Agent...")
    recommendation_agent.run()