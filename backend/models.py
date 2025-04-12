from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from beanie import Document, Link, PydanticObjectId

class User(Document):
    google_id: str = Field(unique=True)
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None
    
    class Settings:
        name = "users"

class Chat(Document):
    name: Optional[str] = None
    type: str = "direct"  # "direct" or "group"
    participants: List[Link[User]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "chats"

class Message(Document):
    chat: Link[Chat]
    sender: Link[User]
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "messages"

# Pydantic models for API requests/responses
class UserResponse(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None

class ChatCreate(BaseModel):
    name: Optional[str] = None
    participant_ids: List[str] = []

class MessageCreate(BaseModel):
    chat_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    content: str
    sender: UserResponse
    timestamp: datetime
    chat_id: str

class ChatResponse(BaseModel):
    id: str
    name: Optional[str] = None
    type: str
    participants: List[UserResponse]
    created_at: datetime

class ChatWithMessages(ChatResponse):
    messages: List[MessageResponse]
