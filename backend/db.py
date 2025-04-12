from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()  # Load from .env file

MONGO_DETAILS = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.chatdb

users_collection = db.get_collection("users")
messages_collection = db.get_collection("messages")
chats_collection = db.get_collection("chats")
