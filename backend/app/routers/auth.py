import hashlib
import secrets
from datetime import datetime, timezone
import hmac
import time
import base64
from fastapi import APIRouter, Depends, HTTPException, Header, status
from app.database import get_db, get_next_sequence_value
from app.schemas import UserCreate, UserLogin, UserResponse, LoginResponse, PasswordReset

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = "agrichat_super_secret_key_change_me_in_production"

# --- HELPER FUNCTIONS ---

def generate_salt() -> str:
    return secrets.token_hex(16)

def get_password_hash(password: str, salt: str) -> str:
    # Secure PBKDF2 hashing using SHA256
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return key.hex()

def generate_token(user_id: int) -> str:
    # Token valid for 7 days
    expiry = int(time.time()) + (7 * 24 * 60 * 60)
    message = f"{user_id}:{expiry}"
    sig = hmac.new(
        SECRET_KEY.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    raw_token = f"{message}:{sig}"
    return base64.urlsafe_b64encode(raw_token.encode('utf-8')).decode('utf-8')

def verify_token(token: str) -> int | None:
    try:
        decoded = base64.urlsafe_b64decode(token.encode('utf-8')).decode('utf-8')
        parts = decoded.split(":")
        if len(parts) != 3:
            return None
        user_id_str, expiry_str, sig = parts
        
        # Check expiry
        expiry = int(expiry_str)
        if time.time() > expiry:
            return None
            
        # Verify signature
        message = f"{user_id_str}:{expiry_str}"
        expected_sig = hmac.new(
            SECRET_KEY.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(sig, expected_sig):
            return int(user_id_str)
    except Exception:
        pass
    return None

def get_current_user(
    authorization: str | None = Header(None, description="Bearer <token>"),
    db = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication header"
        )
    
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
        
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# --- API ENDPOINTS ---

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db = Depends(get_db)):
    """Create a new supervisor user with a hashed password."""
    # Check if user already exists
    existing = db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
        
    salt = generate_salt()
    hashed = get_password_hash(user_data.password, salt)
    
    next_id = get_next_sequence_value("users")
    doc = {
        "id": next_id,
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": hashed,
        "salt": salt,
        "role": user_data.role or "Supervisor",
        "created_at": datetime.now(timezone.utc)
    }
    db.users.insert_one(doc)
    return doc

@router.post("/login", response_model=LoginResponse)
def login(login_data: UserLogin, db = Depends(get_db)):
    """Authenticate email and password, and return a signed session token."""
    user = db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Verify password
    hashed = get_password_hash(login_data.password, user["salt"])
    if not hmac.compare_digest(hashed, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    token = generate_token(user["id"])
    return {
        "token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user = Depends(get_current_user)):
    """Retrieve the profile details of the currently logged-in user."""
    return current_user

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: PasswordReset, db = Depends(get_db)):
    """Reset user password after matching official email and full name."""
    user = db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )
    if user["name"].lower() != data.name.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The name provided does not match the name on the account."
        )
    # Generate new salt and hash the new password
    salt = generate_salt()
    hashed = get_password_hash(data.new_password, salt)
    db.users.update_one(
        {"id": user["id"]},
        {"$set": {"salt": salt, "hashed_password": hashed}}
    )
    return {"message": "Password reset successfully."}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(current_user = Depends(get_current_user), db = Depends(get_db)):
    """Delete the currently logged-in user and their advisories from the database."""
    user_id = current_user["id"]
    # Delete all advisories belonging to this user
    db.advisories.delete_many({"created_by_id": user_id})
    # Delete the user record
    db.users.delete_one({"id": user_id})
    return None
