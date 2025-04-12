from fastapi import APIRouter
from models import ChatCreate, MessageCreate
from db import chats_collection, messages_collection
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

# Create a new chat (group or direct)
@router.post("/create")
async def create_chat(chat: ChatCreate):
    chat_doc = {
        "name": chat.name,
        "members": chat.members,
        "type": chat.type,
        "created_at": datetime.utcnow()
    }
    result = await chats_collection.insert_one(chat_doc)
    return {"chat_id": str(result.inserted_id)}

# Get all messages from a chat
@router.get("/{chat_id}/messages")
async def get_messages(chat_id: str):
    msgs = await messages_collection.find({"chat_id": chat_id}).sort("timestamp").to_list(100)
    return msgs

# Send a new message to a chat
@router.post("/message")
async def send_message(msg: MessageCreate):
    message_doc = {
        "chat_id": msg.chat_id,
        "sender": msg.sender,
        "text": msg.text,
        "timestamp": datetime.utcnow()
    }
    await messages_collection.insert_one(message_doc)
    return {"status": "sent"}
