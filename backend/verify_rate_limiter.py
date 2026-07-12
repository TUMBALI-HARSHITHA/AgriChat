import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_rate_limiting():
    print("Testing Rate Limiter...")
    login_payload = {
        "email": "rate_limit_test@agri.uk.gov.in",
        "password": "wrongpassword123"
    }
    
    # We expect the rate limit to be 5 requests per client IP.
    # The 6th request should return 429.
    success_count = 0
    throttled_count = 0
    
    for i in range(10):
        r = client.post("/api/auth/login", json=login_payload)
        if r.status_code == 401:
            success_count += 1
        elif r.status_code == 429:
            throttled_count += 1
            print(f"Request {i+1} throttled as expected! (HTTP 429)")
        else:
            print(f"Request {i+1} returned unexpected status code: {r.status_code}")
            
    print(f"Total unauthorized requests (HTTP 401): {success_count}")
    print(f"Total throttled requests (HTTP 429): {throttled_count}")
    
    assert success_count == 5, f"Expected 5 unauthorized attempts, got {success_count}"
    assert throttled_count == 5, f"Expected 5 throttled attempts, got {throttled_count}"
    print("Rate limiting verification passed successfully!")

if __name__ == "__main__":
    test_rate_limiting()
