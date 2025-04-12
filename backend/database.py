import motor.motor_asyncio
from beanie import init_beanie
from models import User, Chat, Message
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB connection string from environment variables
MONGODB_URL = os.getenv("MONGODB_URL") or os.getenv("MONGO_URI")

if not MONGODB_URL:
    raise ValueError("No MongoDB connection URL found in environment variables")

async def init_db():
    try:
        # Create Motor client
        client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        
        # Get the database name from the connection string or use default
        db_name = MONGODB_URL.split('/')[-1].split('?')[0] or 'chat_app'
        
        # Initialize beanie with the MongoDB client and document models
        await init_beanie(
            database=client[db_name],
            document_models=[User, Chat, Message]
        )
        print(f"Initialized Beanie with database: {db_name}")
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise 