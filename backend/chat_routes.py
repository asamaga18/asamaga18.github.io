from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from models import User, Chat, Message, ChatCreate, MessageCreate, ChatResponse, MessageResponse, ChatWithMessages

router = APIRouter()

async def get_or_create_user(google_id: str, email: str, first_name: str = None, last_name: str = None, profile_picture: str = None) -> User:
    user = await User.find_one({"google_id": google_id})
    if not user:
        user = User(
            google_id=google_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            profile_picture=profile_picture
        )
        await user.insert()
    return user

@router.post("/create", response_model=ChatResponse)
async def create_chat(chat_data: ChatCreate):
    # Verify all participants exist
    participants = []
    for user_id in chat_data.participant_ids:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        participants.append(user)
    
    # Create the chat
    chat = Chat(
        name=chat_data.name,
        type="group" if len(participants) > 2 else "direct",
        participants=participants
    )
    await chat.insert()
    
    return ChatResponse(
        id=str(chat.id),
        name=chat.name,
        type=chat.type,
        participants=[UserResponse.from_orm(p) for p in participants],
        created_at=chat.created_at
    )

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: str):
    chat = await Chat.get(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = await Message.find({"chat._id": chat.id}).to_list()
    return [
        MessageResponse(
            id=str(msg.id),
            content=msg.content,
            sender=msg.sender,
            timestamp=msg.timestamp,
            chat_id=str(msg.chat.id)
        ) for msg in messages
    ]

@router.post("/message", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user: User = Depends(get_current_user)):
    chat = await Chat.get(message_data.chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    if current_user.id not in [str(p.id) for p in chat.participants]:
        raise HTTPException(status_code=403, detail="User is not a participant in this chat")
    
    message = Message(
        chat=chat,
        sender=current_user,
        content=message_data.content,
        timestamp=datetime.utcnow()
    )
    await message.insert()
    
    return MessageResponse(
        id=str(message.id),
        content=message.content,
        sender=current_user,
        timestamp=message.timestamp,
        chat_id=str(chat.id)
    ) 