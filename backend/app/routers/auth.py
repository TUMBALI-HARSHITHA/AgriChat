import hashlib
import secrets
from datetime import datetime, timezone
import hmac
import time
import base64
from fastapi import APIRouter, Depends, HTTPException, Header, status
from fastapi.responses import HTMLResponse, RedirectResponse
from app.database import get_db, get_next_sequence_value
from app.schemas import UserCreate, UserLogin, UserResponse, LoginResponse, PasswordReset

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

from app.rate_limiter import RateLimiter
login_limiter = RateLimiter(requests_limit=5, window_seconds=60)
register_limiter = RateLimiter(requests_limit=5, window_seconds=60)

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

import json

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def generate_token(user_id: int) -> str:
    # Token valid for 7 days
    expiry = int(time.time()) + (7 * 24 * 60 * 60)
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"sub": user_id, "exp": expiry}
    
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    header_b64 = base64url_encode(header_json)
    payload_b64 = base64url_encode(payload_json)
    
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        signing_input,
        hashlib.sha256
    ).digest()
    signature_b64 = base64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def verify_token(token: str) -> int | None:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            SECRET_KEY.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()
        expected_signature_b64 = base64url_encode(expected_signature)
        
        if not hmac.compare_digest(signature_b64, expected_signature_b64):
            return None
            
        # Decode payload
        payload_json = base64url_decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_json)
        
        # Check expiry
        if time.time() > payload.get("exp", 0):
            return None
            
        return payload.get("sub")
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

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(register_limiter)])
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

@router.post("/login", response_model=LoginResponse, dependencies=[Depends(login_limiter)])
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

@router.get("/oauth/login/{provider}")
def oauth_login(provider: str):
    if provider not in ["google", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
    # Redirect to the mock consent page
    return RedirectResponse(url=f"/api/auth/oauth/consent/{provider}")

@router.get("/oauth/consent/{provider}", response_class=HTMLResponse)
def oauth_consent(provider: str):
    if provider not in ["google", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
    
    provider_title = provider.capitalize()
    accent_color = "#4285F4" if provider == "google" else "#24292e"
    default_email = f"harshitha.{provider}@agri.uk.gov.in"
    default_name = f"Harshitha {provider_title}"
    
    # Beautiful Google/GitHub style HTML consent screen matching the AgriChat theme
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sign in with {provider_title} - AgriChat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                margin: 0;
                padding: 0;
                background-color: #050805;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                color: #e2e8f0;
            }}
            .card {{
                background: rgba(10, 15, 10, 0.8);
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 24px;
                padding: 40px;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 197, 94, 0.1);
                text-align: center;
                backdrop-filter: blur(12px);
            }}
            .logo-container {{
                display: flex;
                justify-content: center;
                margin-bottom: 24px;
                gap: 12px;
                align-items: center;
            }}
            .logo {{
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #22c55e, #15803d);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
            }}
            .provider-logo {{
                width: 48px;
                height: 48px;
                background: {accent_color};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }}
            h1 {{
                font-size: 22px;
                font-weight: 800;
                margin: 0 0 8px 0;
            }}
            p {{
                font-size: 14px;
                color: #8892b0;
                margin: 0 0 24px 0;
                line-height: 1.5;
            }}
            .form-group {{
                text-align: left;
                margin-bottom: 20px;
            }}
            label {{
                display: block;
                font-size: 12px;
                font-weight: 600;
                color: #22c55e;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}
            input {{
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 12px;
                color: white;
                font-size: 14px;
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.2s;
            }}
            input:focus {{
                border-color: #22c55e;
            }}
            .btn-allow {{
                background: linear-gradient(135deg, #22c55e, #15803d);
                color: white;
                border: none;
                padding: 14px;
                width: 100%;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
                transition: transform 0.1s, opacity 0.2s;
            }}
            .btn-allow:hover {{
                opacity: 0.95;
            }}
            .btn-allow:active {{
                transform: scale(0.98);
            }}
            .btn-cancel {{
                background: transparent;
                color: #8892b0;
                border: none;
                margin-top: 14px;
                font-size: 14px;
                cursor: pointer;
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="logo-container">
                <div class="logo">🌿</div>
                <div style="font-size: 20px; color: #8892b0;">➜</div>
                <div class="provider-logo">{"G" if provider == "google" else "Git"}</div>
            </div>
            <h1>Sign in with {provider_title}</h1>
            <p>Authorize <strong>AgriChat</strong> to access your {provider_title} account information (name and email address).</p>
            <form action="/api/auth/oauth/callback/{provider}" method="get">
                <div class="form-group">
                    <label for="email">OAuth Email Address</label>
                    <input type="email" id="email" name="email" value="{default_email}" required>
                </div>
                <div class="form-group">
                    <label for="name">OAuth Full Name</label>
                    <input type="text" id="name" name="name" value="{default_name}" required>
                </div>
                <button type="submit" class="btn-allow">Authorize & Sign In</button>
            </form>
            <button onclick="window.location.href='http://localhost:5173/login'" class="btn-cancel">Cancel</button>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/oauth/callback/{provider}")
def oauth_callback(provider: str, email: str, name: str, db = Depends(get_db)):
    if provider not in ["google", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
        
    email = email.strip().lower()
    
    # Check if user already exists
    user = db.users.find_one({"email": email})
    if not user:
        salt = generate_salt()
        random_pass = secrets.token_hex(16)
        hashed = get_password_hash(random_pass, salt)
        
        next_id = get_next_sequence_value("users")
        user = {
            "id": next_id,
            "email": email,
            "name": name,
            "hashed_password": hashed,
            "salt": salt,
            "role": "Supervisor",
            "created_at": datetime.now(timezone.utc)
        }
        db.users.insert_one(user)
        
    token = generate_token(user["id"])
    
    user_data = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else str(user["created_at"])
    }
    
    import urllib.parse
    user_json = json.dumps(user_data)
    redirect_url = f"http://localhost:5173/login?token={token}&user={urllib.parse.quote(user_json)}"
    
    return RedirectResponse(url=redirect_url)

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    """Stateless logout confirmation endpoint."""
    return {"message": "Logged out successfully from session."}
