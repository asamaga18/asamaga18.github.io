from models import Base, engine, Session, User, Chat, Message

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db() 