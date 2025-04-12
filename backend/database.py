import motor.motor_asyncio
from beanie import init_beanie
from models import User, Chat, Message
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB connection string from environment variable
MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("No MONGODB_URL found in environment variables")

async def init_db():
    try:
        # Create Motor client
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
        
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        
        # Initialize beanie with the MongoDB client and document models
        await init_beanie(
            database=client.get_default_database(),
            document_models=[User, Chat, Message]
        )
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise 