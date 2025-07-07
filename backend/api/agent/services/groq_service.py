from groq import Groq
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from agent.config.setting import settings
import json
import time
class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.rate_limit_delay = 1  # seconds between requests
        self.last_request_time = 0
    
    def _rate_limit(self):
        """Simple rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        self.last_request_time = time.time()
    
    def generate_response(self, prompt: str, system_prompt: str = None, model: str = "llama3-8b-8192"):
        """Generate AI response with improved error handling"""
        try:
            self._rate_limit()
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
                timeout=30
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._fallback_response(prompt, system_prompt)
    
    def _fallback_response(self, prompt: str, system_prompt: str = None):
        """Provide fallback responses when API fails"""
        if "price" in prompt.lower():
            return '{"price_min": 100, "price_max": 500, "confidence": 0.3}'
        elif "category" in prompt.lower():
            return '{"category": "General", "confidence": 0.5}'
        elif "sentiment" in prompt.lower():
            return '{"sentiment": "neutral", "insights": ["Unable to analyze at this time"]}'
        else:
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    
    def extract_json(self, text: str):
        """Extract JSON from text response"""
        try:
            # Find JSON in the response
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = text[start:end]
                return json.loads(json_str)
            return None
        except:
            return None