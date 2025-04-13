from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordBearer
from models import User, UserResponse
from beanie import PydanticObjectId
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests
import os

router = APIRouter()

class GoogleAuthRequest(BaseModel):
    token: str

# Load configuration from environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    raise ValueError("GOOGLE_CLIENT_ID must be set in environment variables")
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY must be set in environment variables")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

@router.post("/google-auth")
async def google_auth(request: GoogleAuthRequest):
    try:
        print(f"Received token for authentication: {request.token[:20]}...")  # Print first 20 chars for safety
        
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            request.token, requests.Request(), GOOGLE_CLIENT_ID)
        print("Token verified successfully")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid issuer"
            )
        print(f"Found user info - email: {idinfo['email']}, sub: {idinfo['sub']}")

        # Find or create user
        user = await User.find_one({"google_id": idinfo['sub']})
        if not user:
            print("Creating new user")
            user = User(
                google_id=idinfo['sub'],
                email=idinfo['email'],
                first_name=idinfo.get('given_name'),
                last_name=idinfo.get('family_name'),
                profile_picture=idinfo.get('picture')
            )
            await user.create()
            print(f"Created new user with ID: {user.id}")
        else:
            print(f"Updating existing user: {user.id}")
            # Update user information
            user.email = idinfo['email']
            user.first_name = idinfo.get('given_name')
            user.last_name = idinfo.get('family_name')
            user.profile_picture = idinfo.get('picture')
            await user.save()
            print("User updated successfully")

        # Create access token
        access_token = create_access_token(str(user.id))
        print("Access token created")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=str(user.id),
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                profile_picture=user.profile_picture
            )
        }

    except ValueError as e:
        print(f"ValueError during authentication: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected error during authentication: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
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
            status_code=status.HTTP_404_NOT_FOUND,
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