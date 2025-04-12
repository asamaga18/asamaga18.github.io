from fastapi import APIRouter
from post_models import PostCreate
from post_db import posts_collection

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/")
async def create_post(post: PostCreate):
    result = await posts_collection.insert_one(post.dict())
    return {"post_id": str(result.inserted_id)}

@router.get("/")
async def get_all_posts():
    posts = await posts_collection.find().to_list(100)
    return posts
