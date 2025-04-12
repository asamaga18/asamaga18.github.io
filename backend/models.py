from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User model for MongoDB
class User(BaseModel):
    google_id: str
    email: EmailStr
    first_name: str
    last_name: str
    has_account: bool = False

# Used for creating a new chat (group or direct)
class ChatCreate(BaseModel):
    name: Optional[str] = None
    members: List[str]
    type: str  # 'direct' or 'group'

# Used for sending a message
class MessageCreate(BaseModel):
    chat_id: str
    sender: str
    text: str

# Optional: used when returning messages from the DB
class Message(BaseModel):
    sender: str
    text: str
    timestamp: datetime = datetime.utcnow()
