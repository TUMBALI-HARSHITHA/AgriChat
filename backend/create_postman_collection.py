import json

collection = {
    "info": {
        "_postman_id": "8b9e66ff-6fcf-49b8-a7be-e5559cf83cfd",
        "name": "AgriChat Auth & Advisory API",
        "description": "Postman Collection for AgriChat agricultural advisory REST API with JWT Auth. Supports Register, Login (with script to save JWT to env), and protected endpoints.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Health Check",
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{base_url}}/",
                    "host": ["{{base_url}}"],
                    "path": [""]
                },
                "description": "Public health check endpoint."
            }
        },
        {
            "name": "Register User",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "email": "supervisor.postman@agri.uk.gov.in",
                        "name": "Postman Supervisor",
                        "password": "postmansecure123",
                        "role": "Supervisor"
                    }, indent=4)
                },
                "url": {
                    "raw": "{{base_url}}/api/auth/register",
                    "host": ["{{base_url}}"],
                    "path": ["api", "auth", "register"]
                },
                "description": "Register a new supervisor user."
            }
        },
        {
            "name": "Login User",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "const response = pm.response.json();",
                            "if (response.token) {",
                            "    pm.environment.set(\"jwt_token\", response.token);",
                            "    console.log(\"Saved JWT token to environment: \" + response.token);",
                            "}"
                        ],
                        "type": "text/javascript"
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "email": "supervisor.postman@agri.uk.gov.in",
                        "password": "postmansecure123"
                    }, indent=4)
                },
                "url": {
                    "raw": "{{base_url}}/api/auth/login",
                    "host": ["{{base_url}}"],
                    "path": ["api", "auth", "login"]
                },
                "description": "Log in and automatically extract/save JWT token to environment."
            }
        },
        {
            "name": "Get Authenticated Profile (Protected)",
            "request": {
                "method": "GET",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{jwt_token}}"
                    }
                ],
                "url": {
                    "raw": "{{base_url}}/api/auth/me",
                    "host": ["{{base_url}}"],
                    "path": ["api", "auth", "me"]
                },
                "description": "Retrieve current authenticated user profile using the saved JWT token."
            }
        },
        {
            "name": "Get All Advisories (Protected)",
            "request": {
                "method": "GET",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{jwt_token}}"
                    }
                ],
                "url": {
                    "raw": "{{base_url}}/api/advisories/",
                    "host": ["{{base_url}}"],
                    "path": ["api", "advisories", ""]
                },
                "description": "Retrieve all agricultural advisories associated with the authenticated supervisor."
            }
        },
        {
            "name": "Create Advisory (Protected)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{jwt_token}}"
                    },
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "crop": "Mustard",
                        "query": "White rust spots on mustard leaves.",
                        "region": "Pithoragarh",
                        "severity": "High",
                        "status": "Draft"
                    }, indent=4)
                },
                "url": {
                    "raw": "{{base_url}}/api/advisories/",
                    "host": ["{{base_url}}"],
                    "path": ["api", "advisories", ""]
                },
                "description": "Create a new advisory under the current authenticated user's ID."
            }
        },
        {
            "name": "Delete My Advisories (Protected)",
            "request": {
                "method": "DELETE",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{jwt_token}}"
                    }
                ],
                "url": {
                    "raw": "{{base_url}}/api/advisories/",
                    "host": ["{{base_url}}"],
                    "path": ["api", "advisories", ""]
                },
                "description": "Delete all advisories created by the authenticated user."
            }
        },
        {
            "name": "Logout Session",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{jwt_token}}"
                    }
                ],
                "url": {
                    "raw": "{{base_url}}/api/auth/logout",
                    "host": ["{{base_url}}"],
                    "path": ["api", "auth", "logout"]
                },
                "description": "Confirm termination of session (stateless)."
            }
        }
    ]
}

# Write out the JSON files
output_paths = [
    "c:\\Users\\abc\\OneDrive\\Desktop\\AgriChat\\W6_AuthAPICollection_TBI-26101291.json",
    "C:\\Users\\abc\\.gemini\\antigravity\\brain\\34f0d21b-6844-4501-a70f-ab9e0c303f12\\W6_AuthAPICollection_TBI-26101291.json"
]

for path in output_paths:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(collection, f, indent=4)
        print(f"Postman collection successfully generated at: {path}")
