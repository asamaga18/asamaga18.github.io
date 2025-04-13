from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Sample food items data
sample_items = [
    {
        "item_name": "Fresh Tomatoes",
        "category": "vegetables",
        "quantity": "5 lbs",
        "location": "College Park",
        "price": "3.99",
        "description": "Freshly picked organic tomatoes from my backyard garden",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
        "created_at": datetime.utcnow()
    },
    {
        "item_name": "Organic Apples",
        "category": "fruits",
        "quantity": "12 pieces",
        "location": "University Park",
        "price": "5.99",
        "description": "Sweet and crispy Honeycrisp apples, freshly picked",
        "image_url": "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a",
        "created_at": datetime.utcnow()
    },
    {
        "item_name": "Canned Soup",
        "category": "canned",
        "quantity": "6 cans",
        "location": "Hyattsville",
        "price": "8.99",
        "description": "Assorted vegetable soups, unexpired and in perfect condition",
        "image_url": "https://images.unsplash.com/photo-1614646419401-8637c94f84f8",
        "created_at": datetime.utcnow()
    },
    {
        "item_name": "Fresh Milk",
        "category": "dairy",
        "quantity": "1 gallon",
        "location": "Riverdale Park",
        "price": "4.50",
        "description": "Local farm fresh whole milk, expires in 1 week",
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150",
        "created_at": datetime.utcnow()
    },
    {
        "item_name": "Brown Rice",
        "category": "grains",
        "quantity": "10 lbs",
        "location": "College Park",
        "price": "12.99",
        "description": "Organic brown rice, sealed package",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c",
        "created_at": datetime.utcnow()
    }
]

async def populate_database():
    # Connect to MongoDB
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client.tomatotrade
    posts_collection = db.posts

    try:
        # Clear existing posts
        await posts_collection.delete_many({})
        print("Cleared existing posts")

        # Insert sample items
        result = await posts_collection.insert_many(sample_items)
        print(f"Successfully inserted {len(result.inserted_ids)} sample items")

        # Verify the data
        print("\nVerifying inserted data:")
        async for post in posts_collection.find():
            print(f"Found post: {post['item_name']} - {post['category']}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(populate_database()) 