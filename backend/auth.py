from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models import User
from beanie import PydanticObjectId
import jwt
from datetime import datetime, timedelta
from typing import Optional

# Update these with your actual secret key and algorithm
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> User:
    if not token:
        # For development/testing, create a test user if no token is provided
        test_user = await User.find_one({"email": "test@example.com"})
        if not test_user:
            test_user = User(
                google_id="test-user-1",
                email="test@example.com",
                first_name="Test",
                last_name="User"
            )
            await test_user.create()
        return test_user
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    
    user = await User.get(PydanticObjectId(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": user_id}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt 