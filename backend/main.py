from fastapi import FastAPI
from routers import chat
from post_routes import router as post_router

app = FastAPI()

# Register chat-related routes
app.include_router(chat.router)

@app.get("/")
def root():
    return {"msg": "FastAPI with MongoDB is live"}



app.include_router(post_router)
