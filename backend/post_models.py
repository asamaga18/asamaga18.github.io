from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, BeforeValidator
from bson import ObjectId
from typing_extensions import Annotated

# Custom type for ObjectId fields
PyObjectId = Annotated[str, BeforeValidator(lambda x: str(x) if isinstance(x, ObjectId) else x)]

class PostCreate(BaseModel):
    item_name: str = Field(...)
    category: str = Field(...)
    quantity: str = Field(...)
    location: str = Field(...)
    price: str = Field(...)
    description: str = Field(...)
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "json_schema_extra": {
            "example": {
                "item_name": "Laptop",
                "category": "Electronics",
                "quantity": "1 unit",
                "location": "College Park",
                "price": "999.99",
                "description": "Like new laptop for sale",
                "image_url": "https://example.com/laptop.jpg"
            }
        }
    }

class Post(PostCreate):
    id: PyObjectId = Field(alias="_id")

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            ObjectId: str
        },
        "arbitrary_types_allowed": True
    }
