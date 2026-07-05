import traceback
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.database import engine, Base
from app.routers import advisories, auth
from app.config import settings

# Initialize database tables on startup (SQLite)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriChat Advisory API",
    description="REST API for agricultural advisories in Uttarakhand, powered by FastAPI and Google Gemini.",
    version="1.0.0"
)

# CORS Configuration
# Allows requests from local React/Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for HTTP Exceptions (e.g., 404 Not Found, 403 Forbidden)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "status_code": exc.status_code,
                "message": exc.detail
            }
        }
    )

# Exception Handler for Request Validation Errors (e.g., Pydantic parsing issues, missing fields)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        # Get path of the invalid field
        field_path = " -> ".join(str(loc) for loc in error.get("loc", []))
        message = error.get("msg", "Validation error")
        errors.append({
            "field": field_path,
            "issue": message
        })
        
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "message": "Validation failed for one or more request fields.",
                "details": errors
            }
        }
    )

# Catch-all Exception Handler for unexpected server-side exceptions (500 errors)
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log the traceback to the terminal/logs
    print("--- UNHANDLED SERVER EXCEPTION ---")
    traceback.print_exc()
    print("----------------------------------")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "An unexpected internal server error occurred."
            }
        }
    )

# Register/mount API routers
app.include_router(advisories.router)
app.include_router(auth.router)

# Base health and info endpoint
@app.get("/")
def read_root():
    return {
        "app": "AgriChat Advisory API",
        "version": "1.0.0",
        "status": "healthy",
        "docs_url": "/docs"
    }
