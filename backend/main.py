from fastapi import FastAPI
from routers import chat

app = FastAPI()

# Register chat-related routes
app.include_router(chat.router)

@app.get("/")
def root():
    return {"msg": "FastAPI with MongoDB is live"}
