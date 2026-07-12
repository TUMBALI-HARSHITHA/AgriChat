import os
import sys

# Ensure the app folder is in the python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.database import db

# Clear collections to ensure a clean testing environment
db.users.delete_many({})
db.advisories.delete_many({})
db.counters.delete_many({})

client = TestClient(app)

def test_api():
    print("Starting API Verification Tests...")
    
    # 1. Health check / Root
    print("Testing GET / ...")
    r = client.get("/")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert r.json()["status"] == "healthy"
    
    # --- Auth Tests ---
    print("Testing POST /api/auth/register (standard registration)...")
    register_payload = {
        "email": "test_supervisor@agri.uk.gov.in",
        "name": "Harshitha Tumbali",
        "password": "securepassword123",
        "role": "Supervisor"
    }
    r = client.post("/api/auth/register", json=register_payload)
    assert r.status_code == 201, f"Expected 201, got {r.status_code}"
    registered_user = r.json()
    assert registered_user["email"] == "test_supervisor@agri.uk.gov.in"
    assert registered_user["name"] == "Harshitha Tumbali"
    assert "hashed_password" not in registered_user
    
    print("Testing POST /api/auth/register (duplicate email error)...")
    r = client.post("/api/auth/register", json=register_payload)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
    
    print("Testing POST /api/auth/login (invalid login credentials)...")
    invalid_login = {
        "email": "test_supervisor@agri.uk.gov.in",
        "password": "wrongpassword"
    }
    r = client.post("/api/auth/login", json=invalid_login)
    assert r.status_code == 401, f"Expected 401, got {r.status_code}"
    
    print("Testing POST /api/auth/login (successful login)...")
    login_payload = {
        "email": "test_supervisor@agri.uk.gov.in",
        "password": "securepassword123"
    }
    r = client.post("/api/auth/login", json=login_payload)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    login_data = r.json()
    assert "token" in login_data
    token = login_data["token"]
    assert login_data["user"]["name"] == "Harshitha Tumbali"
    
    print("Testing GET /api/auth/me (authenticated user)...")
    headers = {"Authorization": f"Bearer {token}"}
    r = client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert r.json()["email"] == "test_supervisor@agri.uk.gov.in"
    
    print("Testing GET /api/auth/me (unauthenticated/invalid token)...")
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer invalidtokenhere"})
    assert r.status_code == 401, f"Expected 401, got {r.status_code}"
    
    # 2. Get all advisories (initially empty)
    print("Testing GET /api/advisories/ (empty)...")
    r = client.get("/api/advisories/", headers=headers)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert isinstance(r.json(), list)
    assert len(r.json()) == 0
    
    # 3. POST Create advisory
    print("Testing POST /api/advisories/ (standard creation)...")
    payload = {
        "crop": "Potato",
        "query": "My potato crop leaves have yellow spots and are curling.",
        "advice": "Apply organic compost and ensure proper drainage in hillside beds.",
        "region": "Kumaon",
        "severity": "Medium",
        "status": "Draft"
    }
    r = client.post("/api/advisories/", json=payload, headers=headers)
    assert r.status_code == 201, f"Expected 201, got {r.status_code}"
    created = r.json()
    assert created["id"] is not None
    assert created["crop"] == "Potato"
    assert created["advice"] == "Apply organic compost and ensure proper drainage in hillside beds."
    advisory_id = created["id"]
    
    # 4. POST Create advisory with empty advice (calls Gemini or fallback)
    print("Testing POST /api/advisories/ (empty advice fallback)...")
    payload_no_advice = {
        "crop": "Rajma",
        "query": "Rajma beans are falling off the plant before ripening.",
        "region": "Garhwal",
        "severity": "High",
        "status": "Draft"
    }
    r = client.post("/api/advisories/", json=payload_no_advice, headers=headers)
    assert r.status_code == 201, f"Expected 201, got {r.status_code}"
    created_no_advice = r.json()
    assert created_no_advice["advice"] is not None
    assert len(created_no_advice["advice"]) > 0
    rajma_id = created_no_advice["id"]
    
    # 5. GET Single advisory
    print(f"Testing GET /api/advisories/{advisory_id} ...")
    r = client.get(f"/api/advisories/{advisory_id}")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert r.json()["crop"] == "Potato"
    
    # 6. GET List with query filters
    print("Testing GET /api/advisories/ (filtered)...")
    r_crop = client.get("/api/advisories/?crop=potato", headers=headers)
    assert r_crop.status_code == 200
    assert len(r_crop.json()) == 1
    
    r_region = client.get("/api/advisories/?region=Garhwal", headers=headers)
    assert r_region.status_code == 200
    assert len(r_region.json()) == 1
    
    # 7. GET Search advisories (additional endpoint)
    print("Testing GET /api/advisories/search (search endpoint)...")
    r_search = client.get("/api/advisories/search?q=curling")
    assert r_search.status_code == 200
    assert len(r_search.json()) >= 1
    assert r_search.json()[0]["crop"] == "Potato"
    
    # 8. GET stats advisories (additional endpoint)
    print("Testing GET /api/advisories/stats (stats endpoint)...")
    r_stats = client.get("/api/advisories/stats")
    assert r_stats.status_code == 200
    stats = r_stats.json()
    assert stats["total_count"] == 2
    assert stats["by_crop"]["Potato"] == 1
    assert stats["by_crop"]["Rajma"] == 1
    assert stats["by_region"]["Kumaon"] == 1
    assert stats["by_region"]["Garhwal"] == 1
    
    # 9. PUT Update advisory
    print(f"Testing PUT /api/advisories/{advisory_id} (full update)...")
    update_payload = {
        "crop": "Potato",
        "query": "My potato crop leaves have yellow spots and are curling.",
        "advice": "Spray copper oxychloride fungicide immediately.",
        "region": "Almora",
        "severity": "High",
        "status": "Resolved"
    }
    r = client.put(f"/api/advisories/{advisory_id}", json=update_payload, headers=headers)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    updated = r.json()
    assert updated["advice"] == "Spray copper oxychloride fungicide immediately."
    assert updated["region"] == "Almora"
    assert updated["severity"] == "High"
    assert updated["status"] == "Resolved"
    
    # 10. PATCH Partial update advisory
    print(f"Testing PATCH /api/advisories/{advisory_id} (partial update)...")
    patch_payload = {
        "severity": "Medium"
    }
    r = client.patch(f"/api/advisories/{advisory_id}", json=patch_payload, headers=headers)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    patched = r.json()
    assert patched["severity"] == "Medium"
    assert patched["status"] == "Resolved"  # Unchanged
    
    # 11. Exception Handling: 404 Not Found
    print("Testing GET /api/advisories/99999 (404 error handler)...")
    r = client.get("/api/advisories/99999")
    assert r.status_code == 404, f"Expected 404, got {r.status_code}"
    error_res = r.json()
    assert "error" in error_res
    assert error_res["error"]["status_code"] == 404
    assert "not found" in error_res["error"]["message"].lower()
    
    # 12. Exception Handling: 422 Validation Error
    print("Testing POST /api/advisories/ with invalid fields (422 error handler)...")
    invalid_payload = {
        "crop": "P",            # min_length=2 violation
        "query": "Short",       # valid but checking other fields
        "region": "Almora",
        "severity": "Extreme",  # pattern violation (must be Low/Medium/High)
        "status": "Draft"
    }
    r = client.post("/api/advisories/", json=invalid_payload, headers=headers)
    assert r.status_code == 422, f"Expected 422, got {r.status_code}"
    error_res = r.json()
    assert "error" in error_res
    assert error_res["error"]["status_code"] == 422
    assert "details" in error_res["error"]
    assert len(error_res["error"]["details"]) >= 2
    
    # 13. DELETE Advisory
    print(f"Testing DELETE /api/advisories/{advisory_id} ...")
    r = client.delete(f"/api/advisories/{advisory_id}", headers=headers)
    assert r.status_code == 204, f"Expected 204, got {r.status_code}"
    
    # Verify it is deleted
    r = client.get(f"/api/advisories/{advisory_id}")
    assert r.status_code == 404
    
    print("\nAll 13 API Verification Tests Passed Successfully!")

if __name__ == "__main__":
    test_api()
