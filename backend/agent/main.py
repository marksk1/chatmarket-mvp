from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio
from uagents import Agent, Context

# Define the message format
class ChatMessage(BaseModel):
    text: str

# Create the agent
agent = Agent(name="chatbot", seed="chatbot_secret_seed")

# In-memory response storage
inbox = {}

# Define agent behavior
@agent.on_message(model=ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    response = f"Hello! You said: {msg.text}"
    inbox[sender] = response
    await ctx.send(sender, ChatMessage(text=response))

# REST API setup
app = FastAPI()

class Message(BaseModel):
    sender: str
    message: str

@app.post("/send")
async def send_message(data: Message):
    await agent.send(data.sender, ChatMessage(text=data.message))
    await asyncio.sleep(1)
    return {"response": inbox.get(data.sender, "No response yet")}

# Run both FastAPI and uAgent
if __name__ == "__main__":
    import threading

    def run_agent():
        agent.run()

    threading.Thread(target=run_agent, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8080)
