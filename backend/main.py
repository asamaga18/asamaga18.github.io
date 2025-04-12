from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
from datetime import datetime

from models import (
    User, Chat, Message,
    ChatCreate, ChatResponse, MessageCreate, 
    MessageResponse, UserResponse
)
from database import init_db

app = FastAPI(title="Chat API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

# Simplified user authentication
async def get_current_user(x_user_id: Optional[str] = Header(None)) -> User:
    if not x_user_id:
        x_user_id = "test-user-1"
    
    # Get or create user
    user = await User.find_one({"google_id": x_user_id})
    if not user:
        user = User(
            google_id=x_user_id,
            email=f"{x_user_id}@example.com",
            first_name="Test",
            last_name="User",
            profile_picture=None
        )
        await user.insert()
    return user

@app.post("/chat/create", response_model=ChatResponse)
async def create_chat(chat: ChatCreate, current_user: User = Depends(get_current_user)):
    # Create chat with current user as participant
    new_chat = Chat(
        name=chat.name,
        type="direct",
        participants=[current_user]
    )
    await new_chat.insert()
    
    return ChatResponse(
        id=str(new_chat.id),
        name=new_chat.name,
        type=new_chat.type,
        participants=[UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            profile_picture=current_user.profile_picture
        )],
        created_at=new_chat.created_at
    )

@app.get("/chat/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: str, current_user: User = Depends(get_current_user)):
    chat = await Chat.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = await Message.find({"chat.id": chat.id}).to_list()
    
    return [
        MessageResponse(
            id=str(msg.id),
            content=msg.content,
            sender=UserResponse(
                id=str(msg.sender.id),
                email=msg.sender.email,
                first_name=msg.sender.first_name,
                last_name=msg.sender.last_name,
                profile_picture=msg.sender.profile_picture
            ),
            timestamp=msg.timestamp,
            chat_id=str(msg.chat.id)
        )
        for msg in messages
    ]

@app.post("/chat/message", response_model=MessageResponse)
async def send_message(message: MessageCreate, current_user: User = Depends(get_current_user)):
    chat = await Chat.get(message.chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    new_message = Message(
        chat=chat,
        sender=current_user,
        content=message.content,
        timestamp=datetime.utcnow()
    )
    await new_message.insert()
    
    return MessageResponse(
        id=str(new_message.id),
        content=new_message.content,
        sender=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            profile_picture=current_user.profile_picture
        ),
        timestamp=new_message.timestamp,
        chat_id=str(chat.id)
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
