from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostCreate(BaseModel):
    item_name: str
    category: str
    quantity: str
    location: str
    price: str
    description: str
    image_url: Optional[str] = None
    created_at: datetime = datetime.utcnow()
