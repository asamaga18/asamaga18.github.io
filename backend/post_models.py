from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core.core_schema import str_schema
        return str_schema()

    def __str__(self):
        return str(self.binary)

class PostCreate(BaseModel):
    item_name: str = Field(...)
    category: str = Field(...)
    quantity: str = Field(...)
    location: str = Field(...)
    price: float = Field(...)
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
                "price": 999.99,
                "description": "Like new laptop for sale",
                "image_url": "https://example.com/laptop.jpg"
            }
        }
    }

class Post(PostCreate):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            ObjectId: str
        },
        "arbitrary_types_allowed": True
    }
