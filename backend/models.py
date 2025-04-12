from sqlalchemy import Column, String, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    google_id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    has_account = Column(Boolean, default=False)

engine = create_engine('sqlite:///db.sqlite3')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
