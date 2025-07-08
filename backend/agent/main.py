from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio
from uagents import Agent, Context

class ChatMessage(BaseModel):
    text: str

agent = Agent(name="chatbot", seed="chatbot_secret_seed")

# Temporary response store
response_box = {}

@agent.on_message(model=ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    print(f"[AGENT] Received: {msg.text}")
    response_box[sender] = f"Hello! You said: {msg.text}"

app = FastAPI()

class Message(BaseModel):
    sender: str
    message: str

@app.post("/send")
async def send_message(data: Message):
    sender = data.sender
    # Clean any old response
    response_box.pop(sender, None)

    await agent.send(sender, ChatMessage(text=data.message))

    # Wait up to 2s for the response
    for _ in range(20):
        await asyncio.sleep(0.1)
        if sender in response_box:
            return {"response": response_box[sender]}

    return {"error": "Agent did not respond in time"}

if __name__ == "__main__":
    import threading
    threading.Thread(target=agent.run, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8080)
