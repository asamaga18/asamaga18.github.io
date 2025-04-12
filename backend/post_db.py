from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["thetomatotrade"]  # Or whatever DB name you're using
posts_collection = db.get_collection("posts")
