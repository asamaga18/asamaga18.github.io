from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client["tomatotrade"]  # Using the same database name as in the connection string
posts_collection = db.get_collection("posts")
