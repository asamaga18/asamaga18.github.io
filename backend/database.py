import motor.motor_asyncio
from beanie import init_beanie
from models import User, Chat, Message
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB connection string from environment variables
MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("No MongoDB connection URL found in environment variables")

print(f"Connecting to MongoDB at: {MONGODB_URL.split('@')[1]}")  # Print URL without credentials

async def init_db():
    try:
        # Create Motor client
        client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
        
        # Get the database name from the connection string
        db_name = MONGODB_URL.split('/')[-1].split('?')[0]
        print(f"Using database: {db_name}")
        
        # Initialize beanie with the MongoDB client and document models
        await init_beanie(
            database=client[db_name],
            document_models=[User, Chat, Message]
        )
        print(f"Initialized Beanie with database: {db_name}")
        print("Database setup completed successfully!")
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        print("Please check your MONGODB_URL and make sure:")
        print("1. Username and password are correct")
        print("2. IP address is whitelisted in MongoDB Atlas")
        print("3. Database name is correct")
        print("4. Cluster is up and running")
        raise 