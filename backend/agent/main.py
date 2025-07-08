from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio
import threading
from uagents import Agent, Context

# --------------------------
# CONFIGURATION
# --------------------------

# Set this to your real Render public URL when deploying (without `/send`)
RENDER_PUBLIC_URL = "https://chatmarket-mvp.onrender.com"

# --------------------------
# MESSAGE MODELS
# --------------------------

class ChatMessage(BaseModel):
    text: str

class RequestMessage(BaseModel):
    sender: str
    message: str

# --------------------------
# AGENT SETUP
# --------------------------

# Create agent with reachable endpoint for deployment
agent = Agent(
    name="chatbot",
    seed="chatbot_secret_seed",
    endpoint=f"{RENDER_PUBLIC_URL}/send"
)

# In-memory store for responses (simulate inbox)
response_box = {}

@agent.on_message(model=ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    print(f"[Agent] Received from {sender}: {msg.text}")
    reply = f"Hello! You said: {msg.text}"
    response_box[sender] = reply
    print(f"[Agent] Responding: {reply}")

# --------------------------
# FASTAPI SETUP
# --------------------------

app = FastAPI()

@app.post("/send")
async def send_message(data: RequestMessage):
    sender = data.sender
    msg_text = data.message

    # Clear any previous response
    response_box.pop(sender, None)

    # Send message to agent
    await agent.send(sender, ChatMessage(text=msg_text))

    # Wait up to 2 seconds for response
    for _ in range(20):
        await asyncio.sleep(0.1)
        if sender in response_box:
            return {"response": response_box[sender]}

    return {"error": "Agent did not respond in time"}

# --------------------------
# ENTRY POINT
# --------------------------

if __name__ == "__main__":
    threading.Thread(target=agent.run, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8080)
