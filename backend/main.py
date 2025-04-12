from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
from datetime import datetime
from beanie import PydanticObjectId
import traceback
from auth import router as auth_router, get_current_user

from models import (
    User, Chat, Message,
    ChatCreate, ChatResponse, MessageCreate, 
    MessageResponse, UserResponse
)
from database import init_db

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
def root():
    return {"msg": "FastAPI with MongoDB is live"}

@app.get("/users/search")
async def search_users(
    query: str,
    current_user: User = Depends(get_current_user)
) -> List[UserResponse]:
    """Search for users by name or email"""
    users = await User.find({
        "$or": [
            {"email": {"$regex": query, "$options": "i"}},
            {"first_name": {"$regex": query, "$options": "i"}},
            {"last_name": {"$regex": query, "$options": "i"}}
        ],
        "id": {"$ne": current_user.id}  # Exclude current user
    }).to_list()
    
    return [
        UserResponse(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            profile_picture=user.profile_picture
        ) for user in users
    ]

@app.post("/chat/direct/{user_id}")
async def create_direct_chat(
    user_id: str,
    current_user: User = Depends(get_current_user)
) -> ChatResponse:
    """Create or get a direct chat with another user"""
    try:
        # Convert string ID to ObjectId
        target_user_id = PydanticObjectId(user_id)
        
        # Check if target user exists
        target_user = await User.get(target_user_id)
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Check if a direct chat already exists between these users
        existing_chat = await Chat.find_one({
            "type": "direct",
            "participants": {"$all": [current_user.id, target_user_id]}
        })
        
        if existing_chat:
            return ChatResponse(
                id=str(existing_chat.id),
                name=f"{target_user.first_name} {target_user.last_name}",
                type="direct",
                participants=[
                    UserResponse(
                        id=str(target_user.id),
                        email=target_user.email,
                        first_name=target_user.first_name,
                        last_name=target_user.last_name,
                        profile_picture=target_user.profile_picture
                    )
                ]
            )
            
        # Create new direct chat
        new_chat = Chat(
            name=f"{target_user.first_name} {target_user.last_name}",
            type="direct",
            participants=[current_user.id, target_user_id]
        )
        await new_chat.create()
        
        return ChatResponse(
            id=str(new_chat.id),
            name=new_chat.name,
            type="direct",
            participants=[
                UserResponse(
                    id=str(target_user.id),
                    email=target_user.email,
                    first_name=target_user.first_name,
                    last_name=target_user.last_name,
                    profile_picture=target_user.profile_picture
                )
            ]
        )
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid user ID format: {str(ve)}")
    except Exception as e:
        print(f"Error creating direct chat: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/create", response_model=ChatResponse)
async def create_chat(chat: ChatCreate, current_user: User = Depends(get_current_user)):
    try:
        print(f"Creating chat for user: {current_user.id}")
        # Create the new chat with the current user as a participant
        new_chat = Chat(
            name=chat.name,
            type="direct",
            participants=[current_user]  # Add current user as participant
        )
        await new_chat.insert()
        
        # Verify the chat was created
        created_chat = await Chat.get(new_chat.id)
        if not created_chat:
            print(f"Failed to create chat: {new_chat.id}")
            raise HTTPException(status_code=500, detail="Failed to create chat")
            
        print(f"Successfully created chat: {created_chat.id} with participants: {[str(p.id) for p in created_chat.participants]}")
        
        return ChatResponse(
            id=str(created_chat.id),
            name=created_chat.name,
            type=created_chat.type,
            participants=[UserResponse(
                id=str(current_user.id),
                email=current_user.email,
                first_name=current_user.first_name,
                last_name=current_user.last_name,
                profile_picture=current_user.profile_picture
            )],
            created_at=created_chat.created_at
        )
    except Exception as e:
        print(f"Error creating chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: str, current_user: User = Depends(get_current_user)):
    try:
        # Convert string ID to ObjectId
        chat_obj_id = PydanticObjectId(chat_id)
        
        # First verify if the chat exists
        chat = await Chat.get(chat_obj_id)
        if not chat:
            print(f"Chat not found: {chat_id}")
            raise HTTPException(status_code=404, detail=f"Chat with ID {chat_id} not found")
            
        print(f"Found chat: {chat.id}, fetching messages...")
        
        # Try to fetch messages using the chat_id field
        messages = await Message.find({"chat_id": chat_obj_id}).to_list()
        
        if not messages:
            print(f"No messages found for chat {chat_id}")
            # Return empty list instead of 404 since an empty chat is valid
            return []
            
        print(f"Found {len(messages)} messages for chat {chat_id}")
        
        # Build response with resolved sender information
        response_messages = []
        for msg in messages:
            sender = await User.get(msg.sender_id)
            if not sender:
                print(f"Warning: Could not find sender {msg.sender_id} for message {msg.id}")
                continue
                
            response_messages.append(MessageResponse(
                id=str(msg.id),
                content=msg.content,
                sender=UserResponse(
                    id=str(sender.id),
                    email=sender.email,
                    first_name=sender.first_name,
                    last_name=sender.last_name,
                    profile_picture=sender.profile_picture
                ),
                timestamp=msg.timestamp,
                chat_id=str(msg.chat_id)
            ))
        
        return response_messages

    except ValueError as ve:
        print(f"Invalid chat ID format: {chat_id}")
        raise HTTPException(status_code=400, detail=f"Invalid chat ID format: {str(ve)}")
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/message", response_model=MessageResponse)
async def send_message(message: MessageCreate, current_user: User = Depends(get_current_user)):
    try:
        print(f"Attempting to send message to chat {message.chat_id}")
        print(f"Message content: {message.content}")
        print(f"Current user ID: {current_user.id}")

        # Convert chat_id to ObjectId and verify chat exists
        chat_obj_id = PydanticObjectId(message.chat_id)
        chat = await Chat.get(chat_obj_id)
        if not chat:
            print(f"Chat not found: {message.chat_id}")
            raise HTTPException(status_code=404, detail=f"Chat with ID {message.chat_id} not found")

        # Verify user is a participant in the chat by comparing IDs
        # Fetch the actual User documents from the Link objects
        participant_ids = []
        for p in chat.participants:
            participant = await p.fetch()  # Resolve the Link to get the actual User document
            participant_ids.append(str(participant.id))

        if str(current_user.id) not in participant_ids:
            print(f"User {current_user.id} is not in participants: {participant_ids}")
            raise HTTPException(status_code=403, detail="You are not a participant in this chat")

        print(f"Found chat: {chat.id}, creating message...")

        # Create the message document with direct ID references
        new_message = Message(
            content=message.content,
            chat_id=chat.id,
            sender_id=current_user.id,
            timestamp=datetime.utcnow()
        )
        
        try:
            print(f"Saving message: {new_message.content}")
            await new_message.insert()
            print("Message inserted successfully")
        except Exception as insert_error:
            print(f"Insert failed: {str(insert_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to save message: {str(insert_error)}")

        # Verify the message was saved
        saved_message = await Message.get(new_message.id)
        if not saved_message:
            print(f"ERROR: Message {new_message.id} not found after save")
            raise HTTPException(status_code=500, detail="Message creation failed - could not verify message was saved")

        print(f"Message verified: ID={saved_message.id}, Chat={saved_message.chat_id}")

        # Get the sender details for the response
        sender = await User.get(saved_message.sender_id)
        if not sender:
            raise HTTPException(status_code=500, detail="Failed to get sender details")

        # Return the message in the response format
        return MessageResponse(
            id=str(saved_message.id),
            content=saved_message.content,
            sender=UserResponse(
                id=str(sender.id),
                email=sender.email,
                first_name=sender.first_name,
                last_name=sender.last_name,
                profile_picture=sender.profile_picture
            ),
            timestamp=saved_message.timestamp,
            chat_id=str(saved_message.chat_id)
        )

    except ValueError as ve:
        print(f"Invalid chat ID format: {str(ve)}")
        raise HTTPException(status_code=400, detail=f"Invalid chat ID format: {str(ve)}")
    except Exception as e:
        print(f"Error creating message: {str(e)}")
        print(f"Full error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to create message: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
