import time
from fastapi import Request, HTTPException, status

class RateLimiter:
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.history = {}  # client_ip -> list of timestamps

    def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean up timestamps that are outside the time window
        timestamps = self.history.get(client_ip, [])
        timestamps = [t for t in timestamps if now - t < self.window_seconds]
        self.history[client_ip] = timestamps
        
        if len(timestamps) >= self.requests_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many authentication attempts. Please try again later."
            )
        
        self.history[client_ip].append(now)
