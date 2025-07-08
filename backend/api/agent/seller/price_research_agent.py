# agents/seller/price_research_agent.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import requests
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
from typing import Dict, Any, List, Optional
from agent.services.groq_service import GroqService
import json
from tavily import TavilyClient

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

# Initialize agent
price_research_agent = Agent(
    name="price_research_agent",
    port=8006,
    seed="price_research_seed",
    endpoint=["http://localhost:8006/submit"]
)

fund_agent_if_low(price_research_agent.wallet.address())

groq_service = GroqService()

# Initialize Tavily client - you need to set your API key
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "your_tavily_api_key_here")
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

def search_market_prices(product_name: str, product_info: Dict[str, Any]) -> Dict[str, Any]:
    """Search for market prices using Tavily"""
    
    try:
        # Build search query
        search_query = f"{product_name} price market value"
        
        # Add condition if available
        if product_info.get("condition"):
            search_query += f" {product_info['condition']} condition"
        
        # Add brand if available
        if product_info.get("brand"):
            search_query += f" {product_info['brand']}"
        
        # Search using Tavily
        search_results = tavily_client.search(
            query=search_query,
            search_depth="advanced",
            max_results=10,
            include_domains=["amazon.com", "ebay.com", "facebook.com", "craigslist.org", "mercari.com"]
        )
        
        return {
            "results": search_results.get("results", []),
            "query": search_query,
            "success": True
        }
        
    except Exception as e:
        print(f"Tavily search failed: {e}")
        return {
            "results": [],
            "query": search_query,
            "success": False,
            "error": str(e)
        }

def analyze_price_data(search_results: List[Dict], product_info: Dict[str, Any], suggested_price: float) -> Dict[str, Any]:
    """Analyze search results to determine market price"""
    
    # Combine all search result content
    market_data = ""
    for result in search_results:
        market_data += f"Source: {result.get('url', 'Unknown')}\n"
        market_data += f"Content: {result.get('content', '')}\n\n"
    
    analysis_prompt = f"""You are a market price analyst. Analyze this market data for pricing insights:

PRODUCT: {product_info.get('product_name', 'Unknown')}
CONDITION: {product_info.get('condition', 'Unknown')}
BRAND: {product_info.get('brand', 'Unknown')}
SELLER'S SUGGESTED PRICE: ${suggested_price}

MARKET DATA:
{market_data[:3000]}  # Limit to avoid token limits

Based on this market research, provide:
1. Realistic price range (min-max)
2. Optimal selling price
3. Price justification
4. Market positioning advice

Return ONLY a JSON object:
{{
    "price_range": {{"min": number, "max": number}},
    "suggested_price": number,
    "analysis": "detailed price analysis and advice",
    "confidence": 0.85,
    "market_position": "competitive|premium|budget",
    "quick_sell_price": number,
    "max_profit_price": number
}}"""
    
    try:
        response = groq_service.generate_response("", analysis_prompt)
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = response[start:end]
            return json.loads(json_str)
    except Exception as e:
        print(f"Price analysis failed: {e}")
    
    # Fallback analysis
    return {
        "price_range": {"min": suggested_price * 0.8, "max": suggested_price * 1.2},
        "suggested_price": suggested_price,
        "analysis": "Market data analysis temporarily unavailable. Using your suggested price as baseline.",
        "confidence": 0.5,
        "market_position": "competitive",
        "quick_sell_price": suggested_price * 0.9,
        "max_profit_price": suggested_price * 1.1
    }

def search_database_for_similar_items(product_name: str, product_info: Dict[str, Any]) -> List[Dict]:
    """Search your own database for similar items"""
    
    try:
        # Search your FastAPI backend
        search_criteria = {
            "product_type": product_name,
            "condition": product_info.get("condition")
        }
        
        response = requests.post(
            "http://localhost:8000/items/agent/search",
            json=search_criteria,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return []
            
    except Exception as e:
        print(f"Database search failed: {e}")
        return []

@price_research_agent.on_message(model=PriceResearchRequest)
async def handle_price_research(ctx: Context, sender: str, msg: PriceResearchRequest):
    """Handle price research requests"""
    
    print(f"Researching prices for: {msg.product_name}")
    
    # Search market prices
    market_search = search_market_prices(msg.product_name, msg.product_info)
    
    # Search database for similar items
    similar_items = search_database_for_similar_items(msg.product_name, msg.product_info)
    
    # Analyze price data
    if market_search["success"]:
        price_analysis = analyze_price_data(
            market_search["results"], 
            msg.product_info, 
            msg.suggested_price
        )
    else:
        # Fallback to database-only analysis
        price_analysis = analyze_database_prices(similar_items, msg.suggested_price)
    
    # Create response
    response = PriceResearchResponse(
        user_id=msg.user_id,
        market_price_range=price_analysis["price_range"],
        suggested_price=price_analysis["suggested_price"],
        price_analysis=price_analysis["analysis"],
        confidence_score=price_analysis["confidence"]
    )
    
    # Send back to seller conversation agent
    await ctx.send("seller_conversation_agent", response)

def analyze_database_prices(similar_items: List[Dict], suggested_price: float) -> Dict[str, Any]:
    """Analyze prices from database items"""
    
    if not similar_items:
        return {
            "price_range": {"min": suggested_price * 0.8, "max": suggested_price * 1.2},
            "suggested_price": suggested_price,
            "analysis": "No similar items found in our database. Using your suggested price.",
            "confidence": 0.3
        }
    
    # Extract prices
    prices = [item.get("price", 0) for item in similar_items if item.get("price")]
    
    if not prices:
        return {
            "price_range": {"min": suggested_price * 0.8, "max": suggested_price * 1.2},
            "suggested_price": suggested_price,
            "analysis": "Similar items found but no price data available.",
            "confidence": 0.3
        }
    
    min_price = min(prices)
    max_price = max(prices)
    avg_price = sum(prices) / len(prices)
    
    analysis = f"""Based on {len(similar_items)} similar items in our marketplace:
    
💰 **Price Range:** ${min_price:.2f} - ${max_price:.2f}
📊 **Average Price:** ${avg_price:.2f}
🎯 **Your Price:** ${suggested_price:.2f}

"""
    
    if suggested_price > avg_price * 1.2:
        analysis += "⚠️ Your price is above market average - consider lowering for quicker sale."
        final_price = avg_price * 1.1
    elif suggested_price < avg_price * 0.8:
        analysis += "💡 Your price is below market average - you could potentially ask for more."
        final_price = avg_price * 0.9
    else:
        analysis += "✅ Your price is competitive with similar items."
        final_price = suggested_price
    
    return {
        "price_range": {"min": min_price, "max": max_price},
        "suggested_price": final_price,
        "analysis": analysis,
        "confidence": 0.8
    }

# Test code
if __name__ == "__main__":
    import asyncio
    
    class DummyContext:
        async def send(self, recipient: str, msg):
            print(f"[SEND to {recipient}]: {msg}")
    
    async def test_price_research():
        dummy_ctx = DummyContext()
        
        test_request = PriceResearchRequest(
            user_id="test_seller",
            product_name="iPhone 12",
            suggested_price=400.0,
            product_info={
                "condition": "good",
                "brand": "Apple",
                "age": "2 years"
            }
        )
        
        await handle_price_research(dummy_ctx, "test_sender", test_request)
    
    # Run the agent
    price_research_agent.run()