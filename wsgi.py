# from backend.main import app

# if __name__ == "__main__":
#     app.run() 

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)